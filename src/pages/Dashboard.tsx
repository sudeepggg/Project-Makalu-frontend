import React from 'react';
import KPICard from '../components/dashboard/KPICard';
import SalesChart from '../components/dashboard/SalesChart';
import TopProductsTable from '../components/dashboard/TopProductsTable';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const Dashboard: React.FC = () => {
  const { data } = useQuery(['kpis'], async () => (await api.get('/reports/kpis')).data.data);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="This Month Sales" value={`NPR ${(data?.thisMonthSales||0).toLocaleString()}`} />
        <KPICard title="This Year Sales" value={`NPR ${(data?.thisYearSales||0).toLocaleString()}`} />
        <KPICard title="Outstanding" value={`NPR ${(data?.totalOutstanding||0).toLocaleString()}`} />
        <KPICard title="Pending Orders" value={data?.pendingOrders||0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <TopProductsTable items={data?.topProducts || []} />
      </div>
    </div>
  );
};

export default Dashboard;