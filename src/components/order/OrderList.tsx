import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderList: React.FC = () => {
  const { data, isLoading } = useQuery(['orders'], async () => (await api.get(endpoints.orders)).data.data.data);
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <table className="min-w-full text-sm">
        <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th>Total</th></tr></thead>
        <tbody>{data.map((o:any)=> <tr key={o.id} className="border-t"><td>{o.orderNumber}</td><td>{o.customer?.name}</td><td>{new Date(o.orderDate).toLocaleDateString()}</td><td>{o.total}</td></tr>)}</tbody>
      </table>
    </div>
  );
};

export default OrderList;