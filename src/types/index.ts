// Add to existing types
export interface Fee {
  id: string;
  fee_id: string;
  fee_type_id: string;
  project_id?: string;
  transaction_id?: string;
  fee_status: 'AGREED' | 'DUE' | 'PAID';
  amount: number;
  currency: string;
  due_date?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  fee_type?: FeeType;
  project?: Project;
  transaction?: Transaction;
}