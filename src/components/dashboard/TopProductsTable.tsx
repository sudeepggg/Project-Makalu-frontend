import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const TopProductsTable: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const r = await api.get(`${endpoints.reports}/sales`);
      return (r.data.data?.byProduct || []).slice(0, 8);
    },
    staleTime: 60_000,
  });

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg text-primary mb-4">Top Products</h3>
      {isLoading ? <LoadingSpinner size="sm" /> : (
        <div className="space-y-2">
          {(data || []).length === 0 && (
            <p className="text-sm text-ink-faint text-center py-4">No sales data yet</p>
          )}
          {(data || []).map((item: any, i: number) => (
            <div key={item.productId} className="flex items-center gap-3">
              <span className="text-xs font-mono text-ink-faint w-4">{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                <p className="text-xs text-ink-faint font-mono">{item.sku}</p>
              </div>
              <span className="text-sm font-semibold text-primary shrink-0">
                NPR {item.sales?.toLocaleString() ?? 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default TopProductsTable;
