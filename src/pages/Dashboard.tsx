import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PageHeader } from '../components/ui/PageHeader';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { FeeChart } from '../components/dashboard/FeeChart';
import { ProjectTypeChart } from '../components/dashboard/ProjectTypeChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';

interface DashboardStats {
  totalProjects: number;
  totalTransactions: number;
  committedCapital: number;
  activeProjects: number;
  totalEntities: number;
  totalFees: {
    agreed: number;
    due: number;
    paid: number;
  };
  projectsByType: {
    name: string;
    value: number;
  }[];
  recentTransactions: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTransactions: 0,
    committedCapital: 0,
    activeProjects: 0,
    totalEntities: 0,
    totalFees: {
      agreed: 0,
      due: 0,
      paid: 0,
    },
    projectsByType: [],
    recentTransactions: [],
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { data: projects },
          { count: transactionsCount },
          { data: fees },
          { count: entitiesCount },
          { data: recentTxns }
        ] = await Promise.all([
          supabase.from('projects').select('*'),
          supabase.from('transactions').select('*', { count: 'exact' }),
          supabase.from('fees').select('*'),
          supabase.from('entities').select('*', { count: 'exact' }),
          supabase.from('fact_transactions')
            .select('*, project:projects(project_name)')
            .order('transaction_date', { ascending: false })
            .limit(5)
        ]);

        const totalCommittedCapital = projects?.reduce((sum, project) => 
          sum + (project.project_committed_capital_usd || 0), 0) || 0;

        const projectTypes = projects?.reduce((acc: any, project) => {
          acc[project.project_type] = (acc[project.project_type] || 0) + 1;
          return acc;
        }, {});

        const projectsByType = Object.entries(projectTypes || {}).map(([name, value]) => ({
          name,
          value,
        }));

        const feesByStatus = fees?.reduce((acc: any, fee) => {
          acc[fee.fee_status.toLowerCase()] = (acc[fee.fee_status.toLowerCase()] || 0) + fee.amount;
          return acc;
        }, { agreed: 0, due: 0, paid: 0 });

        setStats({
          totalProjects: projects?.length || 0,
          totalTransactions: transactionsCount || 0,
          committedCapital: totalCommittedCapital,
          activeProjects: projects?.filter(p => p.status === 'ACTIVE').length || 0,
          totalEntities: entitiesCount || 0,
          totalFees: feesByStatus || { agreed: 0, due: 0, paid: 0 },
          projectsByType,
          recentTransactions: recentTxns || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your investment portfolio and activities"
      />
      
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FeeChart fees={stats.totalFees} />
        <ProjectTypeChart data={stats.projectsByType} />
        <RecentTransactions transactions={stats.recentTransactions} />
      </div>
    </div>
  );
}