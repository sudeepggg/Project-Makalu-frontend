import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import ProductDetail from "./ProductDetail";
import ProductForm from "./ProductForm";
import { useProducts, useToggleProduct } from "./hooks";

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const { mutate: toggleProductMutation } = useToggleProduct();

  const { data: result, isLoading } = useProducts({
    page,
    limit: 10,
    search,
  });

  const products = result?.data || [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleToggle = (id: string, isActive: boolean) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    toggleProductMutation(
      { id, isActive: !isActive },
      {
        onSettled: () =>
          setTogglingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          }),
      },
    );
  };

  if (selectedId)
    return <ProductDetail id={selectedId} onBack={() => setSelectedId(null)} />;

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or SKU…"
            className="form-field pl-9 py-1.5 text-sm"
          />
        </div>

        <button
          onClick={openAddForm}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Base Price</th>
              <th>Cost Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-ink-faint py-8">
                  No products found
                </td>
              </tr>
            )}
            {products.map((p: any) => {
              const isToggling = togglingIds.has(p.id);
              return (
                <tr
                  key={p.id}
                  className="hover:bg-surface-100 cursor-pointer group"
                >
                  <td className="font-mono text-xs text-ink-muted">{p.sku}</td>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-ink-muted">{p.category?.name || "—"}</td>
                  <td className="font-mono text-sm">
                    NPR {p.basePrice?.toLocaleString()}
                  </td>
                  <td className="font-mono text-sm">
                    NPR {p.costPrice?.toLocaleString()}
                  </td>
                  <td>
                    <ToggleSwitch
                      checked={p.isActive}
                      disabled={isToggling}
                      onChange={() => handleToggle(p.id, !p.isActive)}
                      size="sm"
                    />
                  </td>
                  <td className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(p);
                      }}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(p.id);
                      }}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between text-sm text-ink-muted">
          <span>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-secondary py-1 px-2 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary py-1 px-2 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <Modal
        open={showForm}
        onClose={handleFormClose}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <ProductForm product={editingProduct} onSaved={handleFormClose} />
      </Modal>
    </div>
  );
};

export default ProductList;
