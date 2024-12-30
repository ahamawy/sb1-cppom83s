/*
  # Create fee types

  1. New Data
    - Add standard fee types for the system
    
  2. Changes
    - Insert fee type records if they don't exist
*/

INSERT INTO fee_types (fee_type_id, fee_type_name, fee_type_category)
VALUES 
  ('FEE_TYPE_001', 'Performance Fee', 'PERFORMANCE'),
  ('FEE_TYPE_002', 'Management Fee', 'MANAGEMENT'),
  ('FEE_TYPE_003', 'Structuring Fee', 'UPFRONT'),
  ('FEE_TYPE_004', 'Admin Fee', 'ADMIN')
ON CONFLICT (fee_type_id) DO NOTHING;