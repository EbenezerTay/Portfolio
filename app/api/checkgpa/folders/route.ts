import { NextRequest, NextResponse } from "next/server";
import { validateCheckGpaRequest } from "@/lib/checkgpa-auth";
import { sql } from "@/lib/db";

export async function GET() {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const rows = await sql`SELECT id, name, sort_order, created_at FROM gpa_folders ORDER BY sort_order ASC, created_at ASC`;
    return NextResponse.json(rows);
  } catch (e) {
    console.error("checkgpa folders list", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }
    const sortOrder = typeof body?.sort_order === "number" ? body.sort_order : 0;
    const rows = await sql`
      INSERT INTO gpa_folders (name, sort_order)
      VALUES (${name}, ${sortOrder})
      RETURNING id, name, sort_order, created_at
    `;
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("checkgpa folder create", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
