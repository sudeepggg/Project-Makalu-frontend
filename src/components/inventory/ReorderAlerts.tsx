import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

const ReorderAlerts: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => (await api.get(`${endpoints.inventory}/alerts/low-stock`)).data.data,
    staleTime: 60_000,
  });

  const items = Array.isArray(data) ? data : [];

  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200 flex items-center gap-2">
        <AlertTriangle size={17} className="text-amber-500" />
        <h3 className="font-display text-lg text-primary">Reorder Alerts</h3>
        {items.length > 0 && (
          <span className="ml-auto bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">{items.length}</span>
        )}
      </div>
      {isLoading ? <LoadingSpinner size="sm" /> : (
        <div className="divide-y divide-surface-200">
          {items.length === 0 && (
            <div className="p-6 text-center text-sm text-ink-faint">All stock levels are healthy ✓</div>
          )}
          {items.map((i: any) => (
            <div key={i.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-ink">{i.product?.name}</p>
                <p className="text-xs text-ink-faint font-mono">{i.product?.sku} · {i.warehouse?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">{i.quantityAvailable} available</p>
                <p className="text-xs text-ink-faint">Reorder at: {i.product?.reorderLevel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ReorderAlerts;
