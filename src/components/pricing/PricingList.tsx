import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const PricingList: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['price-lists'],
    queryFn: async () => (await api.get(`${endpoints.pricing}/price-lists`)).data.data,
    staleTime: 60_000,
  });

  const lists = Array.isArray(data) ? data : [];

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200"><h3 className="font-display text-lg text-primary">Active Price Lists</h3></div>
      <div className="divide-y divide-surface-200">
        {lists.length === 0 && <div className="p-6 text-center text-sm text-ink-faint">No price lists found</div>}
        {lists.map((pl: any) => (
          <div key={pl.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-ink">{pl.name}</p>
                <p className="text-xs text-ink-faint mt-0.5">{pl.description}</p>
              </div>
              <span className="badge-active">{pl.discountType}</span>
            </div>
            <div className="mt-2 text-sm text-ink-muted font-mono">
              {pl.discountType === 'PERCENTAGE' ? `${pl.discountValue}% off` : `NPR ${pl.discountValue} off`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PricingList;
