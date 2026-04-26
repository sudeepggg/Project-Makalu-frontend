import React from 'react';

const StockMovementLog: React.FC<{ items?: any[] }> = ({ items = [] }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">Stock Movements</h3>
    <table className="min-w-full text-sm">
      <thead><tr><th>Product</th><th>Warehouse</th><th>Type</th><th>Qty</th><th>Date</th></tr></thead>
      <tbody>{items.map(m=> <tr key={m.id} className="border-t"><td>{m.product?.sku}</td><td>{m.warehouse?.name}</td><td>{m.movementType}</td><td>{m.quantity}</td><td>{new Date(m.createdAt).toLocaleString()}</td></tr>)}</tbody>
    </table>
  </div>
);

export default StockMovementLog;