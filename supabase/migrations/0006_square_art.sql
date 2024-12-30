/*
  # Fix fees table relationships

  1. Changes
    - Drop and recreate fees table with proper foreign key relationships
    - Ensure all references are properly defined
    - Maintain existing RLS policies and triggers
*/

-- Drop existing fees table and recreate with proper relationships
DROP TABLE IF EXISTS fees;

CREATE TABLE fees (
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

-- Enable RLS
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow authenticated users full access to fees"
  ON fees
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_fees_updated_at
  BEFORE UPDATE ON fees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();