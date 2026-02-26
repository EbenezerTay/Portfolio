import { NextRequest, NextResponse } from "next/server";
import { validateCheckGpaRequest } from "@/lib/checkgpa-auth";
import { sql } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing folder id" }, { status: 400 });
  try {
    const rows = await sql`
      SELECT id, folder_id, name, grade, credits, created_at
      FROM gpa_modules
      WHERE folder_id = ${id}::uuid
      ORDER BY created_at ASC
    `;
    return NextResponse.json(rows);
  } catch (e) {
    console.error("checkgpa modules list", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing folder id" }, { status: 400 });
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const grade = typeof body?.grade === "string" ? body.grade.trim() : "";
    const credits = typeof body?.credits === "number" ? body.credits : Number(body?.credits);
    if (!name || !grade) {
      return NextResponse.json({ error: "Module name and grade are required" }, { status: 400 });
    }
    const cred = Number.isFinite(credits) && credits >= 0 ? credits : 0;
    const rows = await sql`
      INSERT INTO gpa_modules (folder_id, name, grade, credits)
      VALUES (${id}::uuid, ${name}, ${grade}, ${cred})
      RETURNING id, folder_id, name, grade, credits, created_at
    `;
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("checkgpa module create", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
