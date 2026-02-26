# Personal GPA Calculator (`/checkgpa`)

This is a **private** GPA calculator only you can access. It uses Neon PostgreSQL and is protected by a secret.

## 1. Create the database tables in Neon

1. Open [Neon Console](https://console.neon.tech) → your project → **SQL Editor**.
2. Run the contents of **`scripts/neon-gpa-schema.sql`** (creates `gpa_folders` and `gpa_modules`).

## 2. Environment variables

Add to `.env` (and **do not** commit real values to git):

```env
# Neon PostgreSQL (get from Neon dashboard; use a new password if you shared the old one)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Secret only you know – required to open /checkgpa (e.g. a long random string)
CHECKGPA_SECRET=your-secret-here
```

- **DATABASE_URL**: In Neon, go to your project → Connection details → copy the connection string.
- **CHECKGPA_SECRET**: Any string only you know (e.g. 16+ random characters). You’ll need it to open `/checkgpa` or to set the cookie via `/checkgpa?k=YOUR_SECRET`.

## 3. How to use

- Open **`/checkgpa`**. You’ll be asked for your secret (or use **`/checkgpa?k=YOUR_SECRET`** once to set the cookie).
- **Add folders** (e.g. “Polytechnic”, “University”) and name them as you like.
- **Open a folder** and add **modules** (name, grade letter, credits). GPA is computed per folder.
- Grades use a 4.0 scale (A, A-, B+, B, …). Edit `lib/db.ts` → `GRADE_POINTS` if you use a different scale.

## Security

- Keep **CHECKGPA_SECRET** and **DATABASE_URL** only in `.env` (and add `.env` to `.gitignore` if it isn’t already).
- If you ever shared your Neon password, **reset it** in the Neon dashboard and update **DATABASE_URL**.
