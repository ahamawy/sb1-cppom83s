/*
  # Add buyer and seller entity fields to transactions

  1. Changes
    - Add buyer_id and seller_id columns to fact_transactions table
    - Add foreign key constraints to entities table
    - Update RLS policies
*/

-- Add entity reference columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_transactions' AND column_name = 'buyer_id'
  ) THEN
    ALTER TABLE fact_transactions 
    ADD COLUMN buyer_id uuid REFERENCES entities(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fact_transactions' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE fact_transactions 
    ADD COLUMN seller_id uuid REFERENCES entities(id);
  END IF;
END $$;