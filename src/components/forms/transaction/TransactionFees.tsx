import { ChangeEvent } from 'react';
import { Transaction } from '../../../types';

interface FeeFields {
  performance_fee_agreed?: number;
  annual_management_fee?: number;
  upfront_structuring_fee?: number;
  admin_fee_fixed?: number;
}

interface TransactionFeesProps {
  formData: Partial<Transaction & FeeFields>;
  onChange: (data: Partial<Transaction & FeeFields>) => void;
  show: boolean;
}

export function TransactionFees({ formData, onChange, show }: TransactionFeesProps) {
  if (!show) return null;

  const handleFeeChange = (field: keyof FeeFields) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="border-t border-white/10 mt-6 pt-6">
      <h3 className="text-lg font-medium text-white mb-4">Fee Structure</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-white">
            Performance Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.performance_fee_agreed || ''}
            onChange={handleFeeChange('performance_fee_agreed')}
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Annual Management Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.annual_management_fee || ''}
            onChange={handleFeeChange('annual_management_fee')}
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Upfront Structuring Fee (USD)
          </label>
          <input
            type="number"
            min="0"
            value={formData.upfront_structuring_fee || ''}
            onChange={handleFeeChange('upfront_structuring_fee')}
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Fixed Admin Fee (USD)
          </label>
          <input
            type="number"
            min="0"
            value={formData.admin_fee_fixed || ''}
            onChange={handleFeeChange('admin_fee_fixed')}
            className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}