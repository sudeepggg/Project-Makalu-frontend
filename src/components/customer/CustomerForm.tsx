import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', customerTypeId: '', email: '', phone: '', city: '', creditLimit: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch customer types from backend
  const { data: typesData } = useQuery({
    queryKey: ['customer-types'],
    queryFn: async () => {
      // CustomerType endpoint isn't exposed directly — we'll use customers list to infer
      // Use a workaround: list customers and extract unique types
      try {
        const r = await api.get(endpoints.customers, { params: { limit: 1 } });
        return r.data.data;
      } catch { return null; }
    },
    staleTime: 300_000,
  });

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post(endpoints.customers, { ...form, creditLimit: Number(form.creditLimit) });
      setForm({ name: '', customerTypeId: '', email: '', phone: '', city: '', creditLimit: 0 });
      qc.invalidateQueries({ queryKey: ['customers'] });
      onSaved?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create customer.');
    } finally { setLoading(false); }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Customer</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="form-label">Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} className="form-field" placeholder="Customer name" required />
        </div>
        <div>
          <label className="form-label">Customer Type ID *</label>
          <input value={form.customerTypeId} onChange={e => set('customerTypeId', e.target.value)} className="form-field" placeholder="UUID from DB" required />
          <p className="text-xs text-ink-faint mt-1">Use the customer type UUID from your database seed</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="form-field" placeholder="email@example.com" />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className="form-field" placeholder="+977-…" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">City</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} className="form-field" placeholder="Kathmandu" />
          </div>
          <div>
            <label className="form-label">Credit Limit (NPR)</label>
            <input type="number" value={form.creditLimit} onChange={e => set('creditLimit', e.target.value)} className="form-field" min={0} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : 'Create Customer'}
        </button>
      </form>
    </div>
  );
};
export default CustomerForm;
