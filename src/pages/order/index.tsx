import { Plus } from "lucide-react";
import { useState } from "react";
import Modal from "../../components/common/Modal";
import OrderDetail from "./OrderDetail";
import OrderForm from "./OrderForm";
import OrderList from "./OrderList";

const Orders = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (selectedId) {
    return (
      <div className="">
        <OrderDetail id={selectedId} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full h-full">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Order
        </button>
      </div>
      <OrderList onSelect={(id) => setSelectedId(id)} />
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Create Order"
        size="md"
      >
        <OrderForm onSaved={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
export default Orders;
