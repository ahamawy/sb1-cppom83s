/*
  # Initial Database Schema

  1. New Tables
    - projects
      - id (uuid, primary key)
      - project_code (text, unique)
      - name (text)
      - project_type (text)
      - seller (text)
      - client_name (text)
      - portfolio_companies (text[])
      - holding_entity (text)
      - committed_capital (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - entities
      - id (uuid, primary key)
      - entity_code (text, unique)
      - legal_name (text)
      - entity_type (text)
      - country (text)
      - primary_email (text)
      - secondary_email (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - transactions
      - id (uuid, primary key)
      - transaction_code (text, unique)
      - transaction_type (text)
      - transaction_date (date)
      - project_id (uuid, references projects)
      - buyer_id (uuid, references entities)
      - seller_id (uuid, references entities)
      - nominee_entity_id (uuid, references entities)
      - gross_commitment (numeric)
      - net_commitment (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - fees
      - id (uuid, primary key)
      - fee_type (text)
      - fee_basis (text)
      - fee_duration (text)
      - fee_status (text)
      - amount (numeric)
      - project_id (uuid, references projects)
      - transaction_id (uuid, references transactions)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code text UNIQUE NOT NULL,
  name text NOT NULL,
  project_type text NOT NULL,
  seller text,
  client_name text,
  portfolio_companies text[],
  holding_entity text,
  committed_capital numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create entities table
CREATE TABLE IF NOT EXISTS entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_code text UNIQUE NOT NULL,
  legal_name text NOT NULL,
  entity_type text NOT NULL,
  country text,
  primary_email text,
  secondary_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code text UNIQUE NOT NULL,
  transaction_type text NOT NULL,
  transaction_date date NOT NULL,
  project_id uuid REFERENCES projects(id),
  buyer_id uuid REFERENCES entities(id),
  seller_id uuid REFERENCES entities(id),
  nominee_entity_id uuid REFERENCES entities(id),
  gross_commitment numeric DEFAULT 0,
  net_commitment numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type text NOT NULL,
  fee_basis text NOT NULL,
  fee_duration text,
  fee_status text NOT NULL,
  amount numeric DEFAULT 0,
  project_id uuid REFERENCES projects(id),
  transaction_id uuid REFERENCES transactions(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow authenticated users full access to projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users full access to entities"
  ON entities
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users full access to transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users full access to fees"
  ON fees
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fees_updated_at
  BEFORE UPDATE ON fees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();