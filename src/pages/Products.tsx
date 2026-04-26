import React from 'react';
import ProductList from '../components/product/ProductList';
import ProductForm from '../components/product/ProductForm';

const Products: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Products</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2"><ProductList /></div>
      <div><ProductForm onSaved={()=>window.location.reload()} /></div>
    </div>
  </div>
);

export default Products;