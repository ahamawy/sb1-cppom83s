import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/format';

interface StatsGridProps {
  stats: {
    totalProjects: number;
    totalTransactions: number;
    committedCapital: number;
    totalEntities: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card 
        title="Total Projects" 
        value={stats.totalProjects}
        subtitle="Active projects"
        className="from-indigo-600/40 to-indigo-900/40"
      />
      <Card 
        title="Total Transactions" 
        value={stats.totalTransactions}
        subtitle="Across all projects"
        className="from-emerald-600/40 to-emerald-900/40"
      />
      <Card 
        title="Committed Capital" 
        value={formatCurrency(stats.committedCapital)}
        subtitle="Total investment"
        className="from-violet-600/40 to-violet-900/40"
      />
      <Card 
        title="Total Entities" 
        value={stats.totalEntities}
        subtitle="Investors & partners"
        className="from-amber-600/40 to-amber-900/40"
      />
    </div>
  );
}