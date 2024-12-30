/*
  # Add underlying valuation to transactions

  1. Changes
    - Add underlying_valuation column to fact_transactions table
    - Make price_per_unit_usd computed from net_capital_commit and no_of_units
*/

ALTER TABLE fact_transactions
  ADD COLUMN IF NOT EXISTS underlying_valuation numeric,
  ALTER COLUMN price_per_unit_usd DROP NOT NULL,
  ALTER COLUMN price_per_unit_usd DROP DEFAULT,
  ALTER COLUMN price_per_unit_usd SET DATA TYPE numeric;

-- Update price_per_unit_usd to be computed
ALTER TABLE fact_transactions 
  DROP COLUMN IF EXISTS price_per_unit_usd CASCADE;

ALTER TABLE fact_transactions
  ADD COLUMN price_per_unit_usd numeric 
  GENERATED ALWAYS AS (
    CASE 
      WHEN no_of_units = 0 THEN 0 
      ELSE net_capital_commit / no_of_units 
    END
  ) STORED;