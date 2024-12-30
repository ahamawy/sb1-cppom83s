import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface FeeChartProps {
  fees: {
    agreed: number;
    due: number;
    paid: number;
  };
}

export function FeeChart({ fees }: FeeChartProps) {
  const data = [
    { name: 'Agreed', amount: fees.agreed },
    { name: 'Due', amount: fees.due },
    { name: 'Paid', amount: fees.paid },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-6 backdrop-blur-lg border border-white/10">
      <h2 className="text-lg font-semibold mb-6 text-white">Fee Status Breakdown</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: 'rgba(15,23,42,0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
            />
            <Bar dataKey="amount" fill="#60A5FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}