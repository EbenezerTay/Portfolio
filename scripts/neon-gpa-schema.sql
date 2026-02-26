-- Run this in Neon Dashboard: SQL Editor (https://console.neon.tech)
-- Creates tables for your personal GPA calculator (folders + modules).

-- Folders: e.g. "Polytechnic", "University" (you can name them)
CREATE TABLE IF NOT EXISTS gpa_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Modules: each module belongs to a folder (name, grade letter, credits)
CREATE TABLE IF NOT EXISTS gpa_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID NOT NULL REFERENCES gpa_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  credits NUMERIC(4,2) NOT NULL CHECK (credits >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for listing modules by folder
CREATE INDEX IF NOT EXISTS idx_gpa_modules_folder_id ON gpa_modules(folder_id);

-- Optional: order folders by sort_order
CREATE INDEX IF NOT EXISTS idx_gpa_folders_sort ON gpa_folders(sort_order);

COMMENT ON TABLE gpa_folders IS 'GPA calculator folders (e.g. Polytechnic, University)';
COMMENT ON TABLE gpa_modules IS 'Modules/courses under each folder with grade and credits';
