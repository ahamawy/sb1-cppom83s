/*
  # Create documents table and storage

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `document_id` (text, unique)
      - `project_id` (uuid, foreign key)
      - `transaction_id` (uuid, foreign key)
      - `entity_id` (uuid, foreign key)
      - `document_type` (text)
      - `document_name` (text)
      - `document_url` (text)
      - `uploaded_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `documents` table
    - Add policies for authenticated users
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id text UNIQUE NOT NULL,
  project_id uuid REFERENCES projects(id),
  transaction_id uuid REFERENCES fact_transactions(id),
  entity_id uuid REFERENCES entities(id),
  document_type text NOT NULL,
  document_name text NOT NULL,
  document_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users full access to documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();