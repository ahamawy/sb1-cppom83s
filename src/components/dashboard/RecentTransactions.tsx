import { formatCurrency, formatDate } from '../../utils/format';

interface Transaction {
  id: string;
  transaction_id: string;
  transaction_date: string;
  net_capital_commit: number;
  project?: {
    project_name: string;
  };
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-6 backdrop-blur-lg border border-white/10">
      <h2 className="text-lg font-semibold mb-6 text-white">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((tx) => (
              <tr key={tx.id} className="text-white/90 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tx.transaction_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{tx.project?.project_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(tx.transaction_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">
                  {formatCurrency(tx.net_capital_commit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}