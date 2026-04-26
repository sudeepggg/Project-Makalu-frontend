import React from 'react';
import OrderList from '../components/order/OrderList';
import OrderForm from '../components/order/OrderForm';

const Orders: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Orders</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2"><OrderList /></div>
      <div><OrderForm onSaved={()=>window.location.reload()} /></div>
    </div>
  </div>
);

export default Orders;