import { NextResponse } from "next/server";
import { validateCheckGpaRequest } from "@/lib/checkgpa-auth";
import { sql } from "@/lib/db";

/**
 * One-time setup: creates gpa_folders and gpa_modules tables if they don't exist.
 * Call once after setting DATABASE_URL (e.g. GET /api/checkgpa/setup with your secret cookie set).
 */
export async function GET() {
  if (!(await validateCheckGpaRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS gpa_folders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS gpa_modules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        folder_id UUID NOT NULL REFERENCES gpa_folders(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        credits NUMERIC(4,2) NOT NULL CHECK (credits >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_gpa_modules_folder_id ON gpa_modules(folder_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_gpa_folders_sort ON gpa_folders(sort_order)`;
    return NextResponse.json({ ok: true, message: "Tables created or already exist." });
  } catch (e) {
    console.error("checkgpa setup", e);
    return NextResponse.json(
      { error: "Setup failed. Check DATABASE_URL and that the database is reachable." },
      { status: 500 }
    );
  }
}
