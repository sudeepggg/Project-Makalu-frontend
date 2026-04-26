import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductList: React.FC = () => {
  const { data, isLoading } = useProducts();
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <table className="min-w-full">
        <thead className="text-left text-sm text-gray-600"><tr><th>SKU</th><th>Name</th><th>Price</th></tr></thead>
        <tbody>
          {data.map((p:any)=> <tr key={p.id} className="border-t"><td>{p.sku}</td><td>{p.name}</td><td>{p.basePrice}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;