import React, { useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const CustomerForm: React.FC<{ onSaved?: ()=>void }> = ({ onSaved }) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');
  const onSubmit = async (e:any) => {
    e.preventDefault();
    await api.post(endpoints.customers, { name, customerTypeId: typeId, creditLimit: 0 });
    setName(''); setTypeId(''); onSaved?.();
  };
  return (
    <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-2">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" required />
      <input value={typeId} onChange={e=>setTypeId(e.target.value)} placeholder="CustomerTypeId" className="w-full border p-2 rounded" required />
      <div className="flex justify-end"><button className="px-3 py-1 bg-primary text-white rounded">Create</button></div>
    </form>
  );
};

export default CustomerForm;