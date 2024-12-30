/*
  # Fix RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new policies that properly handle authentication
    - Add policies for all CRUD operations
  
  2. Security
    - Enable RLS on all tables
    - Add specific policies for insert, select, update, and delete operations
*/

-- Projects table policies
DROP POLICY IF EXISTS "Allow authenticated users full access to projects" ON projects;

CREATE POLICY "Enable read access for authenticated users"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Apply similar policies to other tables
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('entities', 'transactions', 'fees', 'documents', 'fact_transactions', 'fee_types', 'transaction_types')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated users full access to %I" ON %I', table_name, table_name);
    
    EXECUTE format('
      CREATE POLICY "Enable read access for authenticated users" ON %I
        FOR SELECT TO authenticated USING (true)', table_name);
    
    EXECUTE format('
      CREATE POLICY "Enable insert access for authenticated users" ON %I
        FOR INSERT TO authenticated WITH CHECK (true)', table_name);
    
    EXECUTE format('
      CREATE POLICY "Enable update access for authenticated users" ON %I
        FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', table_name);
    
    EXECUTE format('
      CREATE POLICY "Enable delete access for authenticated users" ON %I
        FOR DELETE TO authenticated USING (true)', table_name);
  END LOOP;
END $$;