/*
  # Update projects table structure

  1. Changes
    - Drop old columns
    - Add new columns with correct names
    - Set proper constraints
  
  2. Security
    - Maintain existing RLS policies
*/

-- Update projects table structure
ALTER TABLE projects
  DROP COLUMN IF EXISTS project_code CASCADE,
  DROP COLUMN IF EXISTS name CASCADE;

-- Ensure required columns exist with proper constraints
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'project_name'
  ) THEN
    ALTER TABLE projects ADD COLUMN project_name text NOT NULL;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_project_name 
  ON projects(project_name);

-- Ensure project_id has proper default
ALTER TABLE projects
  ALTER COLUMN project_id SET DEFAULT 'PRJ-' || floor(extract(epoch from now()))::text;