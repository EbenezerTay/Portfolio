import { NextRequest, NextResponse } from "next/server";
import { getCheckGpaSecret } from "@/lib/checkgpa-auth";

export async function POST(req: NextRequest) {
  const secret = getCheckGpaSecret();
  if (!secret) {
    return NextResponse.json({ error: "GPA calculator not configured." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const token = typeof body?.secret === "string" ? body.secret : "";
  if (token !== secret) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("checkgpa", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
