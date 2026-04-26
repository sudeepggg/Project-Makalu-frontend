import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const PricingHistory: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing-history'],
    queryFn: async () => (await api.get(`${endpoints.pricing}/history`)).data.data,
    staleTime: 60_000,
  });
  const items = Array.isArray(data) ? data.slice(0, 20) : [];

  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200"><h3 className="font-display text-lg text-primary">Pricing History</h3></div>
      {isLoading ? <LoadingSpinner size="sm" /> : (
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Product</th><th>Customer</th><th>Override Price</th><th>Date</th></tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={4} className="text-center text-ink-faint py-6">No pricing history</td></tr>}
              {items.map((h: any) => (
                <tr key={h.id}>
                  <td className="font-medium">{h.product?.name || '—'}</td>
                  <td className="text-ink-muted">{h.customer?.name || '—'}</td>
                  <td className="font-mono">NPR {h.overridePrice?.toLocaleString()}</td>
                  <td className="text-ink-faint text-xs">{new Date(h.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default PricingHistory;
