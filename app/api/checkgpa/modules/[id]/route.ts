import { NextRequest, NextResponse } from "next/server";
import { validateCheckGpaRequest } from "@/lib/checkgpa-auth";
import { sql } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing module id" }, { status: 400 });
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : undefined;
    const grade = typeof body?.grade === "string" ? body.grade.trim() : undefined;
    const credits = typeof body?.credits === "number" ? body.credits : Number(body?.credits);
    if (name !== undefined) {
      await sql`UPDATE gpa_modules SET name = ${name} WHERE id = ${id}::uuid`;
    }
    if (grade !== undefined) {
      await sql`UPDATE gpa_modules SET grade = ${grade} WHERE id = ${id}::uuid`;
    }
    if (Number.isFinite(credits) && credits >= 0) {
      await sql`UPDATE gpa_modules SET credits = ${credits} WHERE id = ${id}::uuid`;
    }
    const rows = await sql`
      SELECT id, folder_id, name, grade, credits, created_at
      FROM gpa_modules WHERE id = ${id}::uuid
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("checkgpa module update", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing module id" }, { status: 400 });
  try {
    await sql`DELETE FROM gpa_modules WHERE id = ${id}::uuid`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("checkgpa module delete", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
