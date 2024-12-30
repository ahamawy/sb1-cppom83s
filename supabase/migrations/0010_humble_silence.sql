-- Update entities table to ensure proper column mapping
ALTER TABLE entities
  DROP COLUMN IF EXISTS entity_legal_name,
  ALTER COLUMN legal_name SET NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_entities_legal_name ON entities(legal_name);

-- Update entity view for consistent API
CREATE OR REPLACE VIEW entity_view AS
SELECT 
  id,
  entity_uuid,
  legal_name as entity_legal_name,
  entity_type,
  country_residence_or_incorporation,
  email1,
  email2,
  address,
  created_at,
  updated_at
FROM entities;