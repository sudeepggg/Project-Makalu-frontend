import React, { useState } from 'react';
import OrderList from '../components/order/OrderList';
import OrderForm from '../components/order/OrderForm';
import OrderDetail from '../components/order/OrderDetail';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';

const Orders: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (selectedId) {
    return (
      <div className="fade-in">
        <OrderDetail id={selectedId} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4 fade-in w-full h-full">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Order
        </button>
      </div>
      <OrderList onSelect={id => setSelectedId(id)} />
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Order" size="md">
        <OrderForm onSaved={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
export default Orders;
