import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const ProductDetail: React.FC<{ id: string }> = ({ id }) => {
  const [p, setP] = useState<any>(null);
  useEffect(()=>{ api.get(`${endpoints.products}/${id}`).then(r=>setP(r.data.data)); },[id]);
  if (!p) return <div>Loading...</div>;
  return <div className="bg-white p-4 rounded shadow"><h3>{p.name}</h3><p>SKU: {p.sku}</p><p>Price: {p.basePrice}</p></div>;
};

export default ProductDetail;