import React, { useState } from 'react';
import ProductList from '../components/product/ProductList';
import ProductForm from '../components/product/ProductForm';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';

const Products: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4 fade-in w-full h-full">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> New Product</button>
      </div>
      <ProductList />
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Product">
        <ProductForm onSaved={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
export default Products;
