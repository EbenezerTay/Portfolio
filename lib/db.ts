import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let client: Sql | null = null;

function getClient(): Sql {
  if (!client) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is not set");
    client = neon(databaseUrl);
  }
  return client;
}

/**
 * Tagged-template SQL client, created on first query rather than at import,
 * so `next build` (and preview deployments without DATABASE_URL) don't crash.
 */
export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getClient()(strings, ...values)) as Sql;

export type Folder = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type Module = {
  id: string;
  folder_id: string;
  name: string;
  grade: string;
  credits: number;
  created_at: string;
};

/** Singapore Poly official grade points (DIST, A, B+, … D-, P, F, ABS) */
export const GRADE_POINTS: Record<string, number> = {
  DIST: 4.0,
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  "D-": 0.5,
  P: 0.5,
  F: 0,
  ABS: 0,
};

export function gradeToPoint(grade: string): number {
  const g = grade.trim().toUpperCase();
  return GRADE_POINTS[g] ?? 0;
}

export function computeGpa(modules: { grade: string; credits: number }[]): number | null {
  if (modules.length === 0) return null;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const m of modules) {
    const pt = gradeToPoint(m.grade);
    totalPoints += pt * Number(m.credits);
    totalCredits += Number(m.credits);
  }
  if (totalCredits === 0) return null;
  const raw = totalPoints / totalCredits;
  return Math.round(raw * 100) / 100;
}
