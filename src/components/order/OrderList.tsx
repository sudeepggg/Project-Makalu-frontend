import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'badge-draft', CONFIRMED: 'badge-confirmed',
  DISPATCHED: 'badge-dispatched', DELIVERED: 'badge-delivered',
};

const OrderList: React.FC<{ onSelect?: (id: string) => void }> = ({ onSelect }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: result, isLoading } = useQuery({
    queryKey: ['orders', page, statusFilter],
    queryFn: async () => {
      const r = await api.get(endpoints.orders, { params: { page, limit: 20, status: statusFilter || undefined } });
      const d = r.data.data;
      return { data: d.data || d, pagination: d.pagination };
    },
  });

  const orders = result?.data || [];
  const pagination = result?.pagination;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="card fade-in">
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="form-field py-1.5 text-sm w-40">
          <option value="">All statuses</option>
          {['DRAFT','CONFIRMED','DISPATCHED','DELIVERED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr><th>Order #</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={5} className="text-center text-ink-faint py-8">No orders found</td></tr>
            )}
            {orders.map((o: any) => (
              <tr key={o.id} onClick={() => onSelect?.(o.id)} className={onSelect ? 'cursor-pointer' : ''}>
                <td className="font-mono text-xs">{o.orderNumber}</td>
                <td className="font-medium">{o.customer?.name}</td>
                <td className="text-ink-muted">{new Date(o.orderDate).toLocaleDateString()}</td>
                <td className="font-mono text-sm">NPR {o.total?.toLocaleString()}</td>
                <td><span className={statusColors[o.status] || 'badge-draft'}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between text-sm text-ink-muted">
          <span>Page {pagination.page} of {pagination.pages} ({pagination.total} orders)</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1 px-2 disabled:opacity-40"><ChevronLeft size={14} /></button>
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1 px-2 disabled:opacity-40"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderList;
