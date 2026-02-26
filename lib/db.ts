import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL ?? "";
export const sql = neon(databaseUrl);

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
