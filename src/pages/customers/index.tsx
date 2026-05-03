import React, { useState } from 'react';
import CustomerList from './CustomerList';
import Modal from '../../components/common/Modal';
import { Plus } from 'lucide-react';
import CustomerForm from './CustomerForm';

const Customers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4 fade-in w-full h-full">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> New Customer</button>
      </div>
      <CustomerList />
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Customer">
        <CustomerForm onSaved={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
export default Customers;
