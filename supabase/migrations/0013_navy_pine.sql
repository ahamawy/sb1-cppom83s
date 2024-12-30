/*
  # Update Projects Table Structure
  
  1. Changes
    - Drop project_code requirement
    - Add default project_id generation
    - Update constraints
*/

ALTER TABLE projects 
  ALTER COLUMN project_code DROP NOT NULL,
  ALTER COLUMN project_id SET DEFAULT 'PRJ-' || floor(extract(epoch from now()))::text;

-- Ensure project_type is properly constrained
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS valid_project_types,
  ADD CONSTRAINT valid_project_types 
    CHECK (project_type IN ('Investment', 'Advisory', 'Advisory Shares'));