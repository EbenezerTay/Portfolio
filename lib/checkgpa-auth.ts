import { cookies, headers } from "next/headers";

const SECRET = process.env.CHECKGPA_SECRET;

export function isCheckGpaAllowed(): boolean {
  if (!SECRET || SECRET.length < 8) return false;
  return true;
}

export async function validateCheckGpaRequest(): Promise<boolean> {
  if (!SECRET || SECRET.length < 8) return false;
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("checkgpa")?.value;
  if (authCookie === SECRET) return true;
  const h = await headers();
  const authHeader = h.get("x-checkgpa-secret");
  return authHeader === SECRET;
}

export function getCheckGpaSecret(): string | undefined {
  return SECRET && SECRET.length >= 8 ? SECRET : undefined;
}
