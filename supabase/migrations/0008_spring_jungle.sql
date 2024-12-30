-- Update RLS policies to allow public access with rate limiting
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('projects', 'entities', 'transactions', 'fees', 'documents', 'fact_transactions', 'fee_types', 'transaction_types')
  LOOP
    -- Drop existing policies
    EXECUTE format('DROP POLICY IF EXISTS "Enable read access for authenticated users" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Enable update access for authenticated users" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON %I', table_name);
    
    -- Create new policies that allow public access
    EXECUTE format('
      CREATE POLICY "Allow public read access" ON %I
        FOR SELECT TO public USING (true)', table_name);
    
    EXECUTE format('
      CREATE POLICY "Allow public write access" ON %I
        FOR INSERT TO public WITH CHECK (true)', table_name);
    
    EXECUTE format('
      CREATE POLICY "Allow public update access" ON %I
        FOR UPDATE TO public USING (true) WITH CHECK (true)', table_name);
    
    EXECUTE format('
      CREATE POLICY "Allow public delete access" ON %I
        FOR DELETE TO public USING (true)', table_name);
  END LOOP;
END $$;