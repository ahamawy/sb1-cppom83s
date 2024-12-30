/*
  # Add Collaborators

  1. Changes
    - Add two new users with full access
    - Grant necessary permissions
  
  2. Security
    - Users will have full access to the database
    - Maintain existing RLS policies
*/

-- Create users if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM auth.users WHERE email = 'mazenlasheen@equitie.com'
  ) THEN
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
    VALUES (
      'mazenlasheen@equitie.com',
      crypt('temporary_password', gen_salt('bf')),
      now()
    );
  END IF;

  IF NOT EXISTS (
    SELECT FROM auth.users WHERE email = 'danieljekov@equitie.com'
  ) THEN
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
    VALUES (
      'danieljekov@equitie.com',
      crypt('temporary_password', gen_salt('bf')),
      now()
    );
  END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;