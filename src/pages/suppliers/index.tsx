import { Plus } from "lucide-react";
import React, { useState } from "react";
import Modal from "../../components/common/Modal";
import SupplierForm from "./SupplierForm";
import SuppliersList from "./SuppliersList";

const Suppliers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4 w-full h-full">
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Supplier
        </button>
      </div>
      <SuppliersList />
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Add Supplier"
      >
        <SupplierForm onSaved={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
export default Suppliers;
