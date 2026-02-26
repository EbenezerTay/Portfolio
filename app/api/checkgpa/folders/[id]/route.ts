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
  if (!id) return NextResponse.json({ error: "Missing folder id" }, { status: 400 });
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : undefined;
    const sortOrder = typeof body?.sort_order === "number" ? body.sort_order : undefined;
    if (name === undefined && sortOrder === undefined) {
      return NextResponse.json({ error: "Provide name or sort_order" }, { status: 400 });
    }
    if (name !== undefined) {
      await sql`UPDATE gpa_folders SET name = ${name} WHERE id = ${id}::uuid`;
    }
    if (sortOrder !== undefined) {
      await sql`UPDATE gpa_folders SET sort_order = ${sortOrder} WHERE id = ${id}::uuid`;
    }
    const rows = await sql`SELECT id, name, sort_order, created_at FROM gpa_folders WHERE id = ${id}::uuid`;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error("checkgpa folder update", e);
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
  if (!id) return NextResponse.json({ error: "Missing folder id" }, { status: 400 });
  try {
    await sql`DELETE FROM gpa_folders WHERE id = ${id}::uuid`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("checkgpa folder delete", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
