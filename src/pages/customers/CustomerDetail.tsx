import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CustomerDetail: React.FC<{ id: string; onBack?: () => void }> = ({ id, onBack }) => {
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => (await api.get(`${endpoints.customers}/${id}`)).data.data,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!customer) return null;

  return (
    <div className="card fade-in">
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-secondary py-1.5 px-2">
            <ArrowLeft size={16} />
          </button>
        )}
        <h3 className="font-display text-xl text-primary">{customer.name}</h3>
        <span className={customer.isActive ? 'badge-active' : 'badge-inactive'}>
          {customer.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <p className="form-label">Customer Type</p>
            <p className="text-sm text-ink">{customer.customerType?.name}</p>
          </div>
          <div>
            <p className="form-label">Email</p>
            <p className="text-sm text-ink">{customer.email || '—'}</p>
          </div>
          <div>
            <p className="form-label">Phone</p>
            <p className="text-sm text-ink">{customer.phone || '—'}</p>
          </div>
          <div>
            <p className="form-label">City</p>
            <p className="text-sm text-ink">{customer.city || '—'}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="form-label">Credit Limit</p>
            <p className="text-sm font-mono text-ink">NPR {customer.creditLimit?.toLocaleString()}</p>
          </div>
          <div>
            <p className="form-label">Credit Used</p>
            <p className="text-sm font-mono text-ink">NPR {customer.creditUsed?.toLocaleString()}</p>
          </div>
          <div>
            <p className="form-label">Payment Terms</p>
            <p className="text-sm text-ink">{customer.paymentTerms || '—'}</p>
          </div>
        </div>
      </div>
      {customer.orders?.length > 0 && (
        <div className="border-t border-surface-200 p-5">
          <p className="form-label mb-3">Recent Orders</p>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead><tr><th>Order #</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {customer.orders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs">{o.orderNumber}</td>
                    <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                    <td><span className={`badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td className="font-mono">NPR {o.total?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerDetail;
