import React, { useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const OrderForm: React.FC<{ onSaved?: ()=>void }> = ({ onSaved }) => {
  const [customerId, setCustomerId] = useState(''); const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const submit = async (e:any) => { e.preventDefault(); await api.post(endpoints.orders, { customerId, items }); onSaved?.(); };
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-2">
      <input value={customerId} onChange={e=>setCustomerId(e.target.value)} placeholder="CustomerId" className="w-full border p-2 rounded" required />
      {items.map((it, idx)=>(
        <div key={idx} className="flex gap-2">
          <input value={it.productId} onChange={e=>{ const copy=[...items]; copy[idx].productId=e.target.value; setItems(copy); }} placeholder="ProductId" className="flex-1 border p-2 rounded" required />
          <input value={it.quantity} onChange={e=>{ const copy=[...items]; copy[idx].quantity=Number(e.target.value); setItems(copy); }} type="number" className="w-24 border p-2 rounded" />
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={()=>setItems([...items,{productId:'',quantity:1}])} className="px-3 py-1 border rounded">Add item</button>
        <div className="flex-1" />
        <button className="px-3 py-1 bg-primary text-white rounded">Create Order</button>
      </div>
    </form>
  );
};

export default OrderForm;