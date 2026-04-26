import React from 'react';
import KPICard from '../components/dashboard/KPICard';
import SalesChart from '../components/dashboard/SalesChart';
import TopProductsTable from '../components/dashboard/TopProductsTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { endpoints } from '../api/endpoints';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => (await api.get(`${endpoints.reports}/kpis`)).data.data,
    staleTime: 30_000,
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-sm text-ink-faint hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="This Month Sales" Icon={TrendingUp} accent="green"
            value={`NPR ${((data?.thisMonthSales) || 0).toLocaleString()}`}
            sub="Confirmed + dispatched + delivered orders"
          />
          <KPICard
            title="Outstanding Payments" Icon={AlertTriangle} accent="red"
            value={`NPR ${((data?.totalOutstanding) || 0).toLocaleString()}`}
            sub="Pending payment amount"
          />
          <KPICard
            title="Pending Orders" Icon={Clock} accent="blue"
            value={data?.pendingOrders ?? 0}
            sub="Draft & confirmed orders"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><SalesChart /></div>
        <TopProductsTable />
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 4b01169e818ab1cdd4d0ad30141d4301933004b5
export default Dashboard;
