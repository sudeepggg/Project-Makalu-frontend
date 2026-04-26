import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

const PricingForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const qc = useQueryClient();
  const [productId, setProductId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [overridePrice, setOverridePrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post(`${endpoints.pricing}/override`, { productId, customerId: customerId || undefined, overridePrice: Number(overridePrice) });
      setProductId(''); setCustomerId(''); setOverridePrice(0);
      qc.invalidateQueries({ queryKey: ['pricing-history'] });
      onSaved?.();
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed to set override.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg text-primary mb-4">Price Override</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div><label className="form-label">Product ID *</label>
          <input value={productId} onChange={e => setProductId(e.target.value)} className="form-field" placeholder="Product UUID" required /></div>
        <div><label className="form-label">Customer ID (optional)</label>
          <input value={customerId} onChange={e => setCustomerId(e.target.value)} className="form-field" placeholder="Leave blank for global override" /></div>
        <div><label className="form-label">Override Price (NPR) *</label>
          <input type="number" value={overridePrice} onChange={e => setOverridePrice(Number(e.target.value))} className="form-field" min={0} required /></div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Saving…' : 'Set Override'}</button>
      </form>
    </div>
  );
};
export default PricingForm;
