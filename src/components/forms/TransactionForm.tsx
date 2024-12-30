import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Transaction, Project, TransactionType } from '../../types';
import { TransactionFormFields } from './transaction/TransactionFormFields';
import { TransactionFees } from './transaction/TransactionFees';
import { createFees, getFeeTypeId } from '../../utils/fees';

interface TransactionFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Transaction>;
}

export function TransactionForm({ onSuccess, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState<Partial<Transaction> & {
    performance_fee_agreed?: number;
    annual_management_fee?: number;
    upfront_structuring_fee?: number;
    admin_fee_fixed?: number;
  }>(initialData || {});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (formData.transaction_type_id) {
      const type = transactionTypes.find(t => t.id === formData.transaction_type_id);
      setSelectedType(type || null);
    }
  }, [formData.transaction_type_id, transactionTypes]);

  const fetchOptions = async () => {
    try {
      const [projectsResponse, typesResponse] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('transaction_types').select('*')
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (typesResponse.error) throw typesResponse.error;

      setProjects(projectsResponse.data || []);
      setTransactionTypes(typesResponse.data || []);
    } catch (error) {
      console.error('Error fetching form options:', error);
      setError('Failed to load form options. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save transaction
      const transactionData = {
        transaction_id: formData.transaction_id || `TXN-${Date.now()}`,
        transaction_date: formData.transaction_date,
        transaction_type_id: formData.transaction_type_id,
        project_id: formData.project_id,
        no_of_units: formData.no_of_units,
        net_capital_commit: formData.net_capital_commit,
        underlying_valuation: formData.underlying_valuation,
        notes: formData.notes
      };

      const { data: savedTransaction, error: txnError } = await supabase
        .from('fact_transactions')
        .upsert([transactionData])
        .select()
        .single();

      if (txnError) throw txnError;

      // Save fees if it's a primary investment or secondary purchase
      if (selectedType?.transaction_type_name === 'Primary Investment' || 
          selectedType?.transaction_type_name === 'Secondary Purchase') {
        const fees = [];
        
        if (formData.performance_fee_agreed) {
          fees.push({
            fee_type_id: await getFeeTypeId('Performance Fee'),
            project_id: formData.project_id!,
            amount: formData.performance_fee_agreed,
            fee_status: 'AGREED'
          });
        }

        if (formData.annual_management_fee) {
          fees.push({
            fee_type_id: await getFeeTypeId('Management Fee'),
            project_id: formData.project_id!,
            amount: formData.annual_management_fee,
            fee_status: 'AGREED'
          });
        }

        if (formData.upfront_structuring_fee) {
          fees.push({
            fee_type_id: await getFeeTypeId('Structuring Fee'),
            project_id: formData.project_id!,
            amount: formData.upfront_structuring_fee,
            fee_status: 'DUE'
          });
        }

        if (formData.admin_fee_fixed) {
          fees.push({
            fee_type_id: await getFeeTypeId('Admin Fee'),
            project_id: formData.project_id!,
            amount: formData.admin_fee_fixed,
            fee_status: 'DUE'
          });
        }

        if (fees.length > 0) {
          await createFees(fees);
        }
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      setError(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const showFees = selectedType?.transaction_type_name === 'Primary Investment' || 
                  selectedType?.transaction_type_name === 'Secondary Purchase';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <TransactionFormFields
        formData={formData}
        onChange={setFormData}
        projects={projects}
        transactionTypes={transactionTypes}
      />

      <TransactionFees
        formData={formData}
        onChange={setFormData}
        show={showFees}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
}