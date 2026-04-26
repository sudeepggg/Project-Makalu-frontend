import React, { useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const ProductForm: React.FC<{ onSaved?: ()=>void }> = ({ onSaved }) => {
  const [sku,setSku]=useState(''); const [name,setName]=useState(''); const [price,setPrice]=useState(0);
  const submit = async (e:any) => { e.preventDefault(); await api.post(endpoints.products, { sku, name, categoryId: '00000000-0000-0000-0000-000000000000', unitOfMeasureId: '00000000-0000-0000-0000-000000000000', basePrice: price }); onSaved?.(); };
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-2">
      <input value={sku} onChange={e=>setSku(e.target.value)} placeholder="SKU" className="w-full border p-2 rounded" required />
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" required />
      <input value={price} onChange={e=>setPrice(Number(e.target.value))} placeholder="Price" className="w-full border p-2 rounded" type="number" required />
      <div className="flex justify-end"><button className="px-3 py-1 bg-primary text-white rounded">Create</button></div>
    </form>
  );
};

export default ProductForm;