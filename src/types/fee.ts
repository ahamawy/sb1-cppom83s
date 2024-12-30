export interface Fee {
  id: string;
  fee_id: string;
  fee_type_id: string;
  project_id?: string;
  transaction_id?: string;
  fee_status: FeeStatus;
  amount: number;
  currency: string;
  due_date?: string;
  payment_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const FEE_STATUSES = ['AGREED', 'DUE', 'PAID'] as const;
export type FeeStatus = typeof FEE_STATUSES[number];