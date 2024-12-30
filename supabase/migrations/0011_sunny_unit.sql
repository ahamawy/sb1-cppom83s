/*
  # Align entity schema with frontend requirements

  1. Changes
    - Ensure consistent column naming
    - Add missing columns
    - Set proper constraints
    - Create view for API compatibility
*/

-- Drop the view if it exists
DROP VIEW IF EXISTS entity_view;

-- Update entities table structure
ALTER TABLE entities
  ADD COLUMN IF NOT EXISTS entity_legal_name text,
  DROP COLUMN IF EXISTS legal_name CASCADE;

-- Make entity_legal_name required
ALTER TABLE entities
  ALTER COLUMN entity_legal_name SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_entities_entity_legal_name 
  ON entities(entity_legal_name);

-- Ensure entity_type is properly constrained
ALTER TABLE entities
  DROP CONSTRAINT IF EXISTS valid_entity_types,
  ADD CONSTRAINT valid_entity_types 
    CHECK (entity_type IN (
      'Individual Investor',
      'Company Investor',
      'Partner',
      'EquiTie Company',
      'Investee Company'
    ));