import React from 'react';

const TopProductsTable: React.FC<{ items?: any[] }> = ({ items = [] }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">Top Products</h3>
    <table className="min-w-full text-sm">
      <thead><tr className="text-left text-gray-600"><th>SKU</th><th>Name</th><th>Sales</th></tr></thead>
      <tbody>
        {items.map(i => <tr key={i.productId} className="border-t"><td>{i.sku}</td><td>{i.name}</td><td>{i.sales}</td></tr>)}
      </tbody>
    </table>
  </div>
);

export default TopProductsTable;