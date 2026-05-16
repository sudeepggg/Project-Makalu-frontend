import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductDetail: React.FC<{ id: string; onBack?: () => void }> = ({ id, onBack }) => {
  const { data: p, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`${endpoints.products}/${id}`)).data.data,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!p) return null;

  return (
    <div className="card fade-in">
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        {onBack && <button onClick={onBack} className="btn-secondary py-1.5 px-2"><ArrowLeft size={16} /></button>}
        <h3 className="font-display text-xl text-primary">{p.name}</h3>
        <span className="font-mono text-xs text-ink-faint border border-surface-300 rounded px-2 py-0.5">{p.sku}</span>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div><p className="form-label">Category</p><p className="text-sm">{p.category?.name || '—'}</p></div>
          <div><p className="form-label">Unit of Measure</p><p className="text-sm">{p.unitOfMeasure?.name || '—'}</p></div>
          <div><p className="form-label">Base Price</p><p className="text-sm font-mono">NPR {p.basePrice?.toLocaleString()}</p></div>
          <div><p className="form-label">Reorder Level</p><p className="text-sm">{p.reorderLevel}</p></div>
        </div>
        <div className="space-y-3">
          <div><p className="form-label">Supplier</p><p className="text-sm">{p.supplier?.name || '—'}</p></div>
          <div><p className="form-label">Description</p><p className="text-sm text-ink-muted">{p.description || '—'}</p></div>
        </div>
      </div>
      {p.inventories?.length > 0 && (
        <div className="border-t border-surface-200 p-5">
          <p className="form-label mb-3">Inventory</p>
          <table className="table-base">
            <thead><tr><th>Warehouse</th><th>On Hand</th><th>Reserved</th><th>Available</th></tr></thead>
            <tbody>
              {p.inventories.map((i: any) => (
                <tr key={i.id}>
                  <td>{i.warehouse?.name}</td>
                  <td className="font-mono">{i.quantityOnHand}</td>
                  <td className="font-mono">{i.quantityReserved}</td>
                  <td className="font-mono">{i.quantityAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ProductDetail;
