import React from 'react';
import InventoryList from '../components/inventory/InventoryList';
import StockMovementLog from '../components/inventory/StockMovementLog';
import ReorderAlerts from '../components/inventory/ReorderAlerts';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const Inventory: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['inventoryPageData'],
    queryFn: async () => {
      const inv = (await api.get('/inventory')).data.data;
      const low = (await api.get('/inventory/alerts/low-stock')).data.data;
      return { inv, low };
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <InventoryList />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StockMovementLog items={data?.inv?.slice(0,10) || []} />
        <ReorderAlerts items={data?.low || []} />
      </div>
    </div>
  );
};

export default Inventory;