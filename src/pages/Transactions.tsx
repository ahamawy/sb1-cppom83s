import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { TransactionForm } from '../components/forms/TransactionForm';
import { formatCurrency, formatDate } from '../utils/format';

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('fact_transactions')
        .select(`
          *,
          transaction_type:transaction_types(transaction_type_name),
          project:projects(project_name),
          buyer:entities!fact_transactions_buyer_id_fkey(entity_legal_name),
          seller:entities!fact_transactions_seller_id_fkey(entity_legal_name)
        `)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Transactions" 
        description="Track and manage investment transactions"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/10">
          <TransactionForm
            onSuccess={() => {
              setShowForm(false);
              fetchTransactions();
            }}
          />
        </div>
      )}

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Price/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Net Commitment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-white">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="text-white/90 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.transaction_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(transaction.transaction_type as any)?.transaction_type_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(transaction.project as any)?.project_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(transaction.buyer as any)?.entity_legal_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(transaction.seller as any)?.entity_legal_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.no_of_units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(transaction.price_per_unit_usd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(transaction.net_capital_commit)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;