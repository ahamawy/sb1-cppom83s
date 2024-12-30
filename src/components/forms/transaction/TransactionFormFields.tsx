import { ChangeEvent } from 'react';
import { Transaction } from '../../../types';
import { calculatePricePerUnit } from './TransactionCalculator';
import { EntitySelector } from './EntitySelector';

interface TransactionFormFieldsProps {
  formData: Partial<Transaction>;
  onChange: (data: Partial<Transaction>) => void;
  projects: any[];
  transactionTypes: any[];
}

export function TransactionFormFields({ 
  formData, 
  onChange, 
  projects, 
  transactionTypes 
}: TransactionFormFieldsProps) {
  const handleNumberChange = (field: keyof Transaction) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const updates: Partial<Transaction> = { [field]: value };
    
    if (field === 'net_capital_commit' || field === 'no_of_units') {
      const units = field === 'no_of_units' ? value : (formData.no_of_units || 0);
      const commitment = field === 'net_capital_commit' ? value : (formData.net_capital_commit || 0);
      updates.price_per_unit_usd = calculatePricePerUnit(commitment, units);
    }
    
    onChange({ ...formData, ...updates });
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-white">
          Transaction Type
        </label>
        <select
          required
          value={formData.transaction_type_id || ''}
          onChange={(e) => onChange({ ...formData, transaction_type_id: e.target.value })}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Type</option>
          {transactionTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.transaction_type_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white">
          Project
        </label>
        <select
          required
          value={formData.project_id || ''}
          onChange={(e) => onChange({ ...formData, project_id: e.target.value })}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>

      <EntitySelector
        label="Buyer"
        value={formData.buyer_id}
        onChange={(value) => onChange({ ...formData, buyer_id: value })}
        required
      />

      <EntitySelector
        label="Seller"
        value={formData.seller_id}
        onChange={(value) => onChange({ ...formData, seller_id: value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-white">
          Transaction Date
        </label>
        <input
          type="date"
          required
          value={formData.transaction_date || ''}
          onChange={(e) => onChange({ ...formData, transaction_date: e.target.value })}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">
          Net Commitment (USD)
        </label>
        <input
          type="number"
          required
          value={formData.net_capital_commit || ''}
          onChange={handleNumberChange('net_capital_commit')}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">
          Number of Units
        </label>
        <input
          type="number"
          required
          value={formData.no_of_units || ''}
          onChange={handleNumberChange('no_of_units')}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">
          Price per Unit (USD)
        </label>
        <input
          type="number"
          readOnly
          value={formData.price_per_unit_usd || ''}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">
          Underlying Valuation (USD)
        </label>
        <input
          type="number"
          value={formData.underlying_valuation || ''}
          onChange={(e) => onChange({ ...formData, underlying_valuation: parseFloat(e.target.value) || 0 })}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-white">
          Notes
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => onChange({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}