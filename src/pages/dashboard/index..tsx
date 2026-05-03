import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useKpis } from "./hooks";
import KPICard from "./KPICard";
import SalesChart from "./SalesChart";
import TopProductsTable from "./TopProductsTable";

const Dashboard: React.FC = () => {
  const { data, isLoading } = useKpis({ types: "kpis" });

  return (
    <div className="space-y-6 fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-sm text-ink-faint hidden sm:block">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="This Month Sales"
            Icon={TrendingUp}
            accent="green"
            value={`NPR ${(data?.thisMonthSales || 0).toLocaleString()}`}
            sub="Confirmed + dispatched + delivered orders"
          />
          <KPICard
            title="Outstanding Payments"
            Icon={AlertTriangle}
            accent="red"
            value={`NPR ${(data?.totalOutstanding || 0).toLocaleString()}`}
            sub="Pending payment amount"
          />
          <KPICard
            title="Pending Orders"
            Icon={Clock}
            accent="blue"
            value={data?.pendingOrders ?? 0}
            sub="Draft & confirmed orders"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <TopProductsTable />
      </div>
    </div>
  );
};

export default Dashboard;
