import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { endpoints } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Reports: React.FC = () => {
  const { data: kpis, isLoading: kLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => (await api.get(`${endpoints.reports}/kpis`)).data.data,
  });
  const { data: sales, isLoading: sLoading } = useQuery({
    queryKey: ['sales-report'],
    queryFn: async () => (await api.get(`${endpoints.reports}/sales`)).data.data,
  });
  const { data: inv, isLoading: iLoading } = useQuery({
    queryKey: ['inventory-report'],
    queryFn: async () => (await api.get(`${endpoints.reports}/inventory`)).data.data,
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="page-header"><h1 className="page-title">Reports</h1></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="form-label">This Month Sales</p>
          {kLoading ? <LoadingSpinner size="sm" /> : <p className="font-display text-2xl text-primary">NPR {kpis?.thisMonthSales?.toLocaleString() ?? 0}</p>}
        </div>
        <div className="card p-5">
          <p className="form-label">Outstanding</p>
          {kLoading ? <LoadingSpinner size="sm" /> : <p className="font-display text-2xl text-primary">NPR {kpis?.totalOutstanding?.toLocaleString() ?? 0}</p>}
        </div>
        <div className="card p-5">
          <p className="form-label">Pending Orders</p>
          {kLoading ? <LoadingSpinner size="sm" /> : <p className="font-display text-2xl text-primary">{kpis?.pendingOrders ?? 0}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b border-surface-200"><h3 className="font-display text-lg text-primary">Top Products by Sales</h3></div>
          {sLoading ? <LoadingSpinner /> : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead><tr><th>Product</th><th>SKU</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                <tbody>
                  {(sales?.byProduct || []).slice(0, 10).map((p: any) => (
                    <tr key={p.productId}>
                      <td className="font-medium">{p.name}</td>
                      <td className="font-mono text-xs text-ink-muted">{p.sku}</td>
                      <td>{p.quantity}</td>
                      <td className="font-mono">NPR {p.sales?.toLocaleString()}</td>
                    </tr>
                  ))}
                  {(sales?.byProduct || []).length === 0 && <tr><td colSpan={4} className="text-center text-ink-faint py-6">No data</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {sales && (
            <div className="p-4 border-t border-surface-200 flex justify-between text-sm text-ink-muted">
              <span>Total Units: <strong>{sales.totalQty?.toLocaleString()}</strong></span>
              <span>Total Sales: <strong className="text-primary">NPR {sales.totalSales?.toLocaleString()}</strong></span>
            </div>
          )}
        </div>

        <div className="card">
          <div className="p-4 border-b border-surface-200"><h3 className="font-display text-lg text-primary">Inventory Summary</h3></div>
          {iLoading ? <LoadingSpinner /> : (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-100 rounded-xl p-4">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-wider">Total Items</p>
                  <p className="font-display text-3xl text-primary mt-1">{inv?.totalItems ?? 0}</p>
                </div>
                <div className="bg-surface-100 rounded-xl p-4">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-wider">Total Value</p>
                  <p className="font-display text-2xl text-primary mt-1">NPR {inv?.totalValue?.toLocaleString() ?? 0}</p>
                </div>
              </div>
              {inv?.byWarehouse && (
                <div>
                  <p className="form-label mb-2">By Warehouse</p>
                  {Object.entries(inv.byWarehouse).map(([name, w]: any) => (
                    <div key={name} className="flex justify-between text-sm py-2 border-b border-surface-200 last:border-0">
                      <span className="font-medium">{name}</span>
                      <span className="text-ink-muted">{w.items} items · NPR {w.value?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reports;
