import React from 'react';
import CustomerList from '../components/customer/CustomerList';
import CustomerForm from '../components/customer/CustomerForm';

const Customers: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Customers</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2"><CustomerList /></div>
      <div><CustomerForm onSaved={()=>window.location.reload()} /></div>
    </div>
  </div>
);

export default Customers;