import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { currency, dateShort } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const fetchOrder = async (id: string) => {
  const res = await api.get(`${endpoints.orders}/${id}`);
  // backend wraps data in data => data, adapt if your API differs
  return res.data.data || res.data;
};

const postAction = async (id: string, action: 'confirm' | 'dispatch' | 'deliver') => {
  const res = await api.post(`${endpoints.orders}/${id}/${action}`);
  return res.data.data || res.data;
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: order, isLoading, isError, refetch } = useQuery(['order', id], () => fetchOrder(id!), {
    enabled: !!id,
  });

  const mutation = useMutation((action: 'confirm' | 'dispatch' | 'deliver') => postAction(id!, action), {
    onSuccess: () => {
      qc.invalidateQueries(['order', id]);
      qc.invalidateQueries(['orders']);
    },
  });

  if (!id) return <div className="p-4">No order id provided</div>;
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-4 text-red-600">Failed to load order</div>;

  const handleAction = async (action: 'confirm' | 'dispatch' | 'deliver') => {
    try {
      await mutation.mutateAsync(action);
      refetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Order {order.orderNumber}</h2>
          <div className="text-sm text-gray-600">
            Status: <span className="font-medium">{order.status}</span> • Ordered: {dateShort(order.orderDate)}
          </div>
        </div>

        <div className="space-x-2">
          {order.status === 'DRAFT' && (
            <button
              onClick={() => handleAction('confirm')}
              disabled={mutation.isLoading}
              className="px-3 py-1 bg-primary text-white rounded"
            >
              {mutation.isLoading ? 'Processing...' : 'Confirm'}
            </button>
          )}

          {order.status === 'CONFIRMED' && (
            <button
              onClick={() => handleAction('dispatch')}
              disabled={mutation.isLoading}
              className="px-3 py-1 bg-yellow-600 text-white rounded"
            >
              {mutation.isLoading ? 'Processing...' : 'Dispatch'}
            </button>
          )}

          {order.status === 'DISPATCHED' && (
            <button
              onClick={() => handleAction('deliver')}
              disabled={mutation.isLoading}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              {mutation.isLoading ? 'Processing...' : 'Deliver'}
            </button>
          )}

          <button onClick={() => navigate('/orders')} className="px-3 py-1 border rounded">
            Back to orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-2">SKU</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount %</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it: any) => (
                <tr key={it.id} className="border-t">
                  <td className="py-2">{it.product?.sku}</td>
                  <td>{it.product?.name}</td>
                  <td>{it.quantity}</td>
                  <td>{currency(it.unitPrice)}</td>
                  <td>{it.discountPercentage ?? 0}%</td>
                  <td>{currency(it.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="text-xl font-semibold">{currency(order.subtotal)}</div>
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold">{currency(order.total)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow space-y-4">
          <div>
            <h4 className="font-semibold">Customer</h4>
            <div className="text-sm">{order.customer?.name}</div>
            <div className="text-sm text-gray-600">{order.customer?.email}</div>
            <div className="text-sm text-gray-600">{order.customer?.phone}</div>
          </div>

          <div>
            <h4 className="font-semibold">Payments</h4>
            {order.payments?.length ? (
              <ul className="space-y-2">
                {order.payments.map((p: any) => (
                  <li key={p.id} className="text-sm border rounded p-2">
                    <div>Amount: {currency(p.amount)}</div>
                    <div className="text-gray-600">Method: {p.paymentMethod}</div>
                    <div className="text-gray-600">Date: {dateShort(p.paymentDate)}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600">No payments found</div>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Meta</h4>
            <div className="text-sm text-gray-600">Order Number: {order.orderNumber}</div>
            <div className="text-sm text-gray-600">Placed: {dateShort(order.orderDate)}</div>
            {order.confirmedDate && <div className="text-sm text-gray-600">Confirmed: {dateShort(order.confirmedDate)}</div>}
            {order.dispatchedDate && <div className="text-sm text-gray-600">Dispatched: {dateShort(order.dispatchedDate)}</div>}
            {order.deliveredDate && <div className="text-sm text-gray-600">Delivered: {dateShort(order.deliveredDate)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;