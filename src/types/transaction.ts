export interface Transaction {
  id: string;
  transaction_id: string;
  transaction_date: string;
  transaction_type_id: string;
  project_id?: string;
  no_of_units: number;
  price_per_unit_usd: number;
  net_capital_commit: number;
  currency_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  project?: {
    project_name: string;
  };
}