import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Fee, FeeType, Project, Transaction } from '../../types';

interface FeeFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Fee>;
}

export function FeeForm({ onSuccess, initialData }: FeeFormProps) {
  const [formData, setFormData] = useState<Partial<Fee>>(initialData || {});
  const [loading, setLoading] = useState(false);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const [
      { data: feeTypesData },
      { data: projectsData },
      { data: transactionsData }
    ] = await Promise.all([
      supabase.from('fee_types').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('fact_transactions').select('*')
    ]);

    setFeeTypes(feeTypesData || []);
    setProjects(projectsData || []);
    setTransactions(transactionsData || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('fees')
        .upsert([
          {
            ...formData,
            fee_id: formData.fee_id || `FEE-${Date.now()}`,
          },
        ])
        .select();

      if (error) throw error;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving fee:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fee Type
          </label>
          <select
            required
            value={formData.fee_type_id || ''}
            onChange={(e) =>
              setFormData({ ...formData, fee_type_id: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Fee Type</option>
            {feeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.fee_type_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            value={formData.project_id || ''}
            onChange={(e) =>
              setFormData({ ...formData, project_id: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction
          </label>
          <select
            value={formData.transaction_id || ''}
            onChange={(e) =>
              setFormData({ ...formData, transaction_id: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Transaction</option>
            {transactions.map((transaction) => (
              <option key={transaction.id} value={transaction.id}>
                {transaction.transaction_id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            required
            value={formData.fee_status || ''}
            onChange={(e) =>
              setFormData({ ...formData, fee_status: e.target.value as Fee['fee_status'] })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Status</option>
            <option value="AGREED">Agreed</option>
            <option value="DUE">Due</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            required
            value={formData.amount || ''}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <input
            type="text"
            required
            value={formData.currency || 'USD'}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date || ''}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Date
          </label>
          <input
            type="date"
            value={formData.payment_date || ''}
            onChange={(e) =>
              setFormData({ ...formData, payment_date: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Saving...' : 'Save Fee'}
        </button>
      </div>
    </form>
  );
}