import React from 'react';
import InventoryList from '../components/inventory/InventoryList';
import StockMovementLog from '../components/inventory/StockMovementLog';
import ReorderAlerts from '../components/inventory/ReorderAlerts';

const Inventory: React.FC = () => (
  <div className="space-y-6 fade-in">
    <div className="page-header">
      <h1 className="page-title">Inventory</h1>
    </div>
    <InventoryList />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StockMovementLog />
      <ReorderAlerts />
    </div>
  </div>
);
export default Inventory;
