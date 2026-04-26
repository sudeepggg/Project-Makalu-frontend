import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const CustomerDetail: React.FC<{ id: string }> = ({ id }) => {
  const [customer, setCustomer] = useState<any>(null);
  useEffect(()=>{ api.get(`${endpoints.customers}/${id}`).then(r=>setCustomer(r.data.data)); },[id]);
  if (!customer) return <div>Loading...</div>;
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{customer.name}</h3>
      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>
    </div>
  );
};

export default CustomerDetail;