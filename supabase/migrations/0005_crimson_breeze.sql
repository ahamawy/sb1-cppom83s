/*
  # Create fees table and add RLS

  1. New Tables
    - `fees`
      - Links to fee_types, projects, and transactions
      - Tracks fee status, amounts, and dates
      - Includes currency and notes fields

  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Create fees table if it doesn't exist
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id text UNIQUE NOT NULL,
  fee_type_id uuid REFERENCES fee_types(id) NOT NULL,
  project_id uuid REFERENCES projects(id),
  transaction_id uuid REFERENCES fact_transactions(id),
  fee_status text NOT NULL CHECK (fee_status IN ('AGREED', 'DUE', 'PAID')),
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  due_date date,
  payment_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'fees' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users full access to fees" ON fees;
  
  CREATE POLICY "Allow authenticated users full access to fees"
    ON fees
    FOR ALL
    TO authenticated
    USING (true);
END $$;

-- Create updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_fees_updated_at'
  ) THEN
    CREATE TRIGGER update_fees_updated_at
      BEFORE UPDATE ON fees
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;