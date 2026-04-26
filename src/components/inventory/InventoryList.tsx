import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const InventoryList: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => (await api.get(endpoints.inventory)).data.data,
    staleTime: 30_000,
  });

  if (isLoading) return <LoadingSpinner />;
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200">
        <h3 className="font-display text-lg text-primary">Current Stock</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr><th>SKU</th><th>Product</th><th>Warehouse</th><th>On Hand</th><th>Reserved</th><th>Available</th></tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={6} className="text-center text-ink-faint py-8">No inventory data</td></tr>}
            {items.map((i: any) => (
              <tr key={i.id}>
                <td className="font-mono text-xs text-ink-muted">{i.product?.sku}</td>
                <td className="font-medium">{i.product?.name}</td>
                <td className="text-ink-muted">{i.warehouse?.name}</td>
                <td className="font-mono">{i.quantityOnHand}</td>
                <td className="font-mono text-amber-600">{i.quantityReserved}</td>
                <td className="font-mono text-primary font-semibold">{i.quantityAvailable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default InventoryList;
