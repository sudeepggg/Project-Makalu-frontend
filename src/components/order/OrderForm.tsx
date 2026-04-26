import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { Plus, Trash2 } from 'lucide-react';

const OrderForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const qc = useQueryClient();
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => setItems(p => [...p, { productId: '', quantity: 1 }]);
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, k: 'productId' | 'quantity', v: any) =>
    setItems(p => { const c = [...p]; c[i] = { ...c[i], [k]: v }; return c; });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post(endpoints.orders, { customerId, items: items.map(it => ({ ...it, quantity: Number(it.quantity) })), notes });
      setCustomerId(''); setNotes(''); setItems([{ productId: '', quantity: 1 }]);
      qc.invalidateQueries({ queryKey: ['orders'] });
      onSaved?.();
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed to create order.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Order</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="form-label">Customer ID *</label>
          <input value={customerId} onChange={e => setCustomerId(e.target.value)} className="form-field" placeholder="Customer UUID" required />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="form-label mb-0">Order Items *</label>
            <button type="button" onClick={addItem} className="btn-secondary py-1 px-2 text-xs">
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input value={it.productId} onChange={e => updateItem(idx, 'productId', e.target.value)}
                  placeholder="Product UUID" className="form-field flex-1 text-sm" required />
                <input type="number" value={it.quantity} min={1}
                  onChange={e => updateItem(idx, 'quantity', e.target.value)}
                  className="form-field w-20 text-sm" />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)} className="p-2 text-red-400 hover:text-red-600 mt-0.5">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="form-field resize-none" placeholder="Optional notes…" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Creating…' : 'Create Order'}
        </button>
      </form>
    </div>
  );
};
export default OrderForm;
