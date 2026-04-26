import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const Pricing: React.FC = () => {
  const { data } = useQuery(['pricelists'], async () => (await api.get('/pricing/price-lists')).data.data);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pricing</h1>
      <div className="bg-white p-4 rounded shadow">
        <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Pricing;