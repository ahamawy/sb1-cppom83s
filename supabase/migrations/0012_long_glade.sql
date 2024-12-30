/*
  # Schema Alignment and Constraints

  1. Changes
    - Add NOT NULL constraints to required columns
    - Add CHECK constraints for enum values
    - Create indexes for performance optimization
    - Set default values for required fields
*/

-- Update projects table
ALTER TABLE projects
  ALTER COLUMN project_name SET NOT NULL,
  ALTER COLUMN project_type SET NOT NULL;

ALTER TABLE projects
  ADD CONSTRAINT valid_project_types 
  CHECK (project_type IN ('Investment', 'Advisory', 'Advisory Shares'));

-- Update transactions table
ALTER TABLE fact_transactions
  ALTER COLUMN transaction_date SET NOT NULL,
  ALTER COLUMN transaction_type_id SET NOT NULL,
  ALTER COLUMN no_of_units SET NOT NULL,
  ALTER COLUMN price_per_unit_usd SET NOT NULL,
  ALTER COLUMN net_capital_commit SET NOT NULL;

-- Update fees table
ALTER TABLE fees
  ALTER COLUMN fee_type_id SET NOT NULL,
  ALTER COLUMN fee_status SET NOT NULL,
  ALTER COLUMN amount SET NOT NULL,
  ALTER COLUMN currency SET NOT NULL;

-- Set default value for currency in a separate statement
ALTER TABLE fees
  ALTER COLUMN currency SET DEFAULT 'USD';

-- Add fee status constraint
ALTER TABLE fees
  ADD CONSTRAINT valid_fee_status 
  CHECK (fee_status IN ('AGREED', 'DUE', 'PAID'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_name 
  ON projects(project_name);

CREATE INDEX IF NOT EXISTS idx_transactions_date 
  ON fact_transactions(transaction_date);

CREATE INDEX IF NOT EXISTS idx_fees_status 
  ON fees(fee_status);

CREATE INDEX IF NOT EXISTS idx_fees_due_date 
  ON fees(due_date);