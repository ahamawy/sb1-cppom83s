/*
  # Investment Admin Schema Update

  1. New Tables
    - transaction_types: Stores different types of transactions (PRIMARY_BUY, SECONDARY_TRADE, etc.)
    - fee_types: Defines various fee structures and calculations
    - fact_transactions: Main transactions table with all deal details
    - entities: Comprehensive entity management (investors, companies, etc.)
    - projects: Investment project details and metadata

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create transaction_types table
CREATE TABLE IF NOT EXISTS transaction_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type_id text UNIQUE NOT NULL,
  transaction_type_name text NOT NULL,
  transaction_type_desc text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fee_types table
CREATE TABLE IF NOT EXISTS fee_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type_id text UNIQUE NOT NULL,
  fee_type_name text NOT NULL,
  fee_type_category text NOT NULL,
  calculation_basis text,
  payment_frequency text,
  max_term_years integer,
  description text,
  currency_payment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Update entities table with new fields
ALTER TABLE entities 
ADD COLUMN IF NOT EXISTS entity_uuid text UNIQUE,
ADD COLUMN IF NOT EXISTS entity_legal_name text,
ADD COLUMN IF NOT EXISTS entity_type text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS dob date,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS country_residence_or_incorporation text,
ADD COLUMN IF NOT EXISTS email1 text,
ADD COLUMN IF NOT EXISTS email2 text,
ADD COLUMN IF NOT EXISTS sector_job text,
ADD COLUMN IF NOT EXISTS passport_incorp text;

-- Update projects table with new fields
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_id text UNIQUE,
ADD COLUMN IF NOT EXISTS project_name text,
ADD COLUMN IF NOT EXISTS project_type text,
ADD COLUMN IF NOT EXISTS project_seller text,
ADD COLUMN IF NOT EXISTS project_client_name text,
ADD COLUMN IF NOT EXISTS project_portfolio_company_lists text[],
ADD COLUMN IF NOT EXISTS project_committed_capital_usd numeric,
ADD COLUMN IF NOT EXISTS project_description text,
ADD COLUMN IF NOT EXISTS fee_rev_type_1 text,
ADD COLUMN IF NOT EXISTS fee_rev_type_2 text,
ADD COLUMN IF NOT EXISTS fee_rev_type_3 text,
ADD COLUMN IF NOT EXISTS fee_rev_type_4 text,
ADD COLUMN IF NOT EXISTS fee_exp_type_1 text,
ADD COLUMN IF NOT EXISTS fee_exp_type_2 text,
ADD COLUMN IF NOT EXISTS fee_exp_type_3 text,
ADD COLUMN IF NOT EXISTS fee_exp_type_4 text,
ADD COLUMN IF NOT EXISTS signed_agreement text;

-- Create fact_transactions table
CREATE TABLE IF NOT EXISTS fact_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  transaction_date date NOT NULL,
  transaction_type_id uuid REFERENCES transaction_types(id),
  project_id uuid REFERENCES projects(id),
  buyer_id uuid REFERENCES entities(id),
  seller_id uuid REFERENCES entities(id),
  nominee_entity_id uuid REFERENCES entities(id),
  no_of_units numeric,
  price_per_unit_usd numeric,
  net_capital_commit numeric,
  currency_code text,
  notes text,
  signing_type text,
  transaction_agreement_status text,
  performance_fee_agreed numeric,
  annual_management_fee numeric,
  upfront_structuring_fee numeric,
  signed_agreement text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transaction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow authenticated users full access to transaction_types"
  ON transaction_types FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to fee_types"
  ON fee_types FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to fact_transactions"
  ON fact_transactions FOR ALL TO authenticated USING (true);

-- Create updated_at triggers for new tables
CREATE TRIGGER update_transaction_types_updated_at
  BEFORE UPDATE ON transaction_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fee_types_updated_at
  BEFORE UPDATE ON fee_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fact_transactions_updated_at
  BEFORE UPDATE ON fact_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();