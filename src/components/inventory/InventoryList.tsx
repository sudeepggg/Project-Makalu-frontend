import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const InventoryList: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => (await api.get(endpoints.inventory)).data.data,
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <table className="min-w-full">
        <thead><tr><th>SKU</th><th>Product</th><th>Warehouse</th><th>On Hand</th><th>Available</th></tr></thead>
        <tbody>{(data as any[])?.map((i:any)=><tr key={i.id} className="border-t"><td>{i.product?.sku}</td><td>{i.product?.name}</td><td>{i.warehouse?.name}</td><td>{i.quantityOnHand}</td><td>{i.quantityAvailable}</td></tr>)}</tbody>
      </table>
    </div>
  );
};

export default InventoryList;