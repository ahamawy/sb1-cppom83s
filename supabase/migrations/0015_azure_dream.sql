/*
  # Fix Transaction Types and Capital Calculations

  1. New Data
    - Add initial transaction types
    - Add indexes for better performance
  
  2. Changes
    - Add computed column for net capital commitment
*/

-- Insert initial transaction types if they don't exist
INSERT INTO transaction_types (transaction_type_id, transaction_type_name, transaction_type_desc)
VALUES 
  ('TXN_TYPE_001', 'Primary Investment', 'Initial investment in a project'),
  ('TXN_TYPE_002', 'Secondary Purchase', 'Purchase of existing shares'),
  ('TXN_TYPE_003', 'Capital Call', 'Additional capital contribution'),
  ('TXN_TYPE_004', 'Distribution', 'Return of capital or profits')
ON CONFLICT (transaction_type_id) DO NOTHING;

-- Add computed column for net capital commitment if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_transactions' 
    AND column_name = 'net_capital_commit'
  ) THEN
    ALTER TABLE fact_transactions 
    ADD COLUMN net_capital_commit numeric 
    GENERATED ALWAYS AS (no_of_units * price_per_unit_usd) STORED;
  END IF;
END $$;