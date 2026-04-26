import React from 'react';

const ReorderAlerts: React.FC<{ items?: any[] }> = ({ items = [] }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">Reorder Alerts</h3>
    <ul>
      {items.map(i=> <li key={i.id}>{i.product?.name} — Available: {i.quantityAvailable} — ReorderLevel: {i.product?.reorderLevel}</li>)}
    </ul>
  </div>
);

export default ReorderAlerts;