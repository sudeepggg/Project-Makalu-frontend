import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const typeColor: Record<string, string> = {
  IN: 'text-green-600', OUT: 'text-red-500', ADJUSTMENT: 'text-amber-600',
};

const StockMovementLog: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: async () => (await api.get(`${endpoints.inventory}/movements`)).data.data,
    staleTime: 30_000,
  });

  const items = Array.isArray(data) ? data.slice(0, 15) : [];

  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200">
        <h3 className="font-display text-lg text-primary">Recent Movements</h3>
      </div>
      {isLoading ? <LoadingSpinner size="sm" /> : (
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Product</th><th>Warehouse</th><th>Type</th><th>Qty</th><th>Date</th></tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="text-center text-ink-faint py-6">No movements yet</td></tr>}
              {items.map((m: any) => (
                <tr key={m.id}>
                  <td className="font-medium">{m.product?.name || m.product?.sku || '—'}</td>
                  <td className="text-ink-muted">{m.warehouse?.name}</td>
                  <td><span className={`font-mono text-xs font-semibold ${typeColor[m.movementType] || ''}`}>{m.movementType}</span></td>
                  <td className="font-mono">{m.quantity}</td>
                  <td className="text-ink-faint text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default StockMovementLog;
