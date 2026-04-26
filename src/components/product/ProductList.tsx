import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductDetail from './ProductDetail';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: result, isLoading } = useProducts({ search: search || undefined, page });
  const products = result?.data || [];
  const pagination = result?.pagination;

  if (isLoading) return <LoadingSpinner />;
  if (selectedId) return <ProductDetail id={selectedId} onBack={() => setSelectedId(null)} />;

  return (
    <div className="card fade-in">
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or SKU…" className="form-field pl-9 py-1.5 text-sm" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr><th>SKU</th><th>Name</th><th>Category</th><th>Base Price</th><th>Status</th></tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center text-ink-faint py-8">No products found</td></tr>
            )}
            {products.map((p: any) => (
              <tr key={p.id} onClick={() => setSelectedId(p.id)} className="cursor-pointer">
                <td className="font-mono text-xs text-ink-muted">{p.sku}</td>
                <td className="font-medium">{p.name}</td>
                <td className="text-ink-muted">{p.category?.name || '—'}</td>
                <td className="font-mono text-sm">NPR {p.basePrice?.toLocaleString()}</td>
                <td>
                  <span className={p.isActive ? 'badge-active' : 'badge-inactive'}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between text-sm text-ink-muted">
          <span>Page {pagination.page} of {pagination.pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1 px-2 disabled:opacity-40"><ChevronLeft size={14} /></button>
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1 px-2 disabled:opacity-40"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductList;
