import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const ProductForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ sku: '', name: '', categoryId: '', unitOfMeasureId: '', basePrice: 0, reorderLevel: 0, description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post(endpoints.products, { ...form, basePrice: Number(form.basePrice), reorderLevel: Number(form.reorderLevel) });
      setForm({ sku: '', name: '', categoryId: '', unitOfMeasureId: '', basePrice: 0, reorderLevel: 0, description: '' });
      qc.invalidateQueries({ queryKey: ['products'] });
      onSaved?.();
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed to create product.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Product</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">SKU *</label>
            <input value={form.sku} onChange={e => set('sku', e.target.value)} className="form-field" placeholder="PRD-001" required />
          </div>
          <div>
            <label className="form-label">Base Price (NPR)</label>
            <input type="number" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} className="form-field" min={0} required />
          </div>
        </div>
        <div>
          <label className="form-label">Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} className="form-field" placeholder="Product name" required />
        </div>
        <div>
          <label className="form-label">Category ID *</label>
          <input value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className="form-field" placeholder="UUID" required />
        </div>
        <div>
          <label className="form-label">Unit of Measure ID *</label>
          <input value={form.unitOfMeasureId} onChange={e => set('unitOfMeasureId', e.target.value)} className="form-field" placeholder="UUID" required />
        </div>
        <div>
          <label className="form-label">Reorder Level</label>
          <input type="number" value={form.reorderLevel} onChange={e => set('reorderLevel', e.target.value)} className="form-field" min={0} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Saving…' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};
export default ProductForm;
