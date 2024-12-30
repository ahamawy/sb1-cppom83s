/*
  # Initialize Required Data and Fix Relationships

  1. Changes
    - Add transaction types
    - Add fee types
    - Add required indexes
    - Update RLS policies
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure transaction types exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM transaction_types WHERE transaction_type_id = 'TXN_TYPE_001'
  ) THEN
    INSERT INTO transaction_types (transaction_type_id, transaction_type_name, transaction_type_desc)
    VALUES 
      ('TXN_TYPE_001', 'Primary Investment', 'Initial investment in a project'),
      ('TXN_TYPE_002', 'Secondary Purchase', 'Purchase of existing shares'),
      ('TXN_TYPE_003', 'Capital Call', 'Additional capital contribution'),
      ('TXN_TYPE_004', 'Distribution', 'Return of capital or profits');
  END IF;
END $$;

-- Ensure fee types exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM fee_types WHERE fee_type_id = 'FEE_TYPE_001'
  ) THEN
    INSERT INTO fee_types (fee_type_id, fee_type_name, fee_type_category)
    VALUES 
      ('FEE_TYPE_001', 'Performance Fee', 'PERFORMANCE'),
      ('FEE_TYPE_002', 'Management Fee', 'MANAGEMENT'),
      ('FEE_TYPE_003', 'Structuring Fee', 'UPFRONT'),
      ('FEE_TYPE_004', 'Admin Fee', 'ADMIN');
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_date'
  ) THEN
    CREATE INDEX idx_transactions_date ON fact_transactions(transaction_date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_project'
  ) THEN
    CREATE INDEX idx_transactions_project ON fact_transactions(project_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_buyer'
  ) THEN
    CREATE INDEX idx_transactions_buyer ON fact_transactions(buyer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_seller'
  ) THEN
    CREATE INDEX idx_transactions_seller ON fact_transactions(seller_id);
  END IF;
END $$;

-- Update RLS policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow public read access" ON fact_transactions;
  DROP POLICY IF EXISTS "Allow public write access" ON fact_transactions;
  DROP POLICY IF EXISTS "Allow public update access" ON fact_transactions;
  DROP POLICY IF EXISTS "Allow public delete access" ON fact_transactions;
END $$;

-- Create new policies
CREATE POLICY "Enable read for all users"
  ON fact_transactions FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON fact_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON fact_transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for all users"
  ON fact_transactions FOR DELETE
  USING (true);