import { Plus } from "lucide-react";
import { useState } from "react";
import Modal from "../../components/common/Modal";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4 fade-in w-full h-full">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Product
        </button>
      </div>
      <ProductList />
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Add Product"
      >
        <ProductForm onSaved={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
export default Products;
