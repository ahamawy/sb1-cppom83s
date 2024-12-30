/*
  # Update entities table constraints

  1. Changes
    - Make entity_code optional since we're using entity_uuid
    - Add default value for entity_uuid if not provided
*/

ALTER TABLE entities 
  ALTER COLUMN entity_code DROP NOT NULL,
  ALTER COLUMN entity_uuid SET DEFAULT 'ENT-' || floor(extract(epoch from now()))::text;