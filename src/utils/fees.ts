import { supabase } from '../lib/supabase';

interface FeeData {
  fee_type_id: string;
  project_id: string;
  amount: number;
  fee_status: 'AGREED' | 'DUE' | 'PAID';
  currency?: string;
}

export async function createFees(fees: FeeData[]) {
  const { error } = await supabase
    .from('fees')
    .insert(fees.map(fee => ({
      ...fee,
      fee_id: `FEE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currency: fee.currency || 'USD'
    })));

  if (error) throw error;
}

export async function getFeeTypeId(name: string): Promise<string> {
  const { data, error } = await supabase
    .from('fee_types')
    .select('id')
    .eq('fee_type_name', name)
    .single();

  if (error) throw error;
  return data.id;
}