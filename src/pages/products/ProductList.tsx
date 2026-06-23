import { ChevronLeft, ChevronRight, Filter, Plus, X } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import SearchBar from "../../components/searchBar";
import SelectField from "../../components/UncontrolledFields/SelectField";
import { useDebounce } from "../../hooks/useDebounce";
import ProductDetail from "./ProductDetail";
import ProductForm from "./ProductForm";
import { useCategoryProducts, useProducts, useToggleProduct } from "./hooks";

interface Filters {
  status: string;
  categoryId: string;
}

const DEFAULT_FILTERS: Filters = {
  status: "",
  categoryId: "",
};

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const { mutate: toggleProductMutation } = useToggleProduct();
  const { data: categoriesResult } = useCategoryProducts();

  const debounceSearch = useDebounce(search, 500);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const { data: result, isLoading } = useProducts({
    page,
    limit: 10,
    debounceSearch,
    categoryId: filters.categoryId || undefined,
    isActive:
      filters.status === "active"
        ? true
        : filters.status === "inactive"
          ? false
          : undefined,
  });

  const products = result?.data || [];
  const categories = categoriesResult?.data || [];
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
      {/* Toolbar */}
      <div className="p-4 border-b border-surface-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1">
          <SearchBar
            value={search}
            onClick={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeHolder="Search by name or SKU…"
          />

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`btn-secondary py-1.5 px-3 flex items-center gap-1.5 relative ${
              showFilters ? "bg-surface-100" : ""
            }`}
          >
            <Filter size={14} />
            <span className="text-sm">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={openAddForm}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="px-4 py-3 border-b border-surface-200 bg-surface-50 flex flex-wrap items-end gap-3">
          {/* Status */}
          <SelectField
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilter("status", e.target.value as Filters["status"])
            }
            className="py-1.5 text-sm"
            options={[
              { label: "All", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />

          {/* Category */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <SelectField
              label="Category"
              value={filters.categoryId}
              onChange={(e) => setFilter("categoryId", e.target.value)}
              className="py-1.5 text-sm"
              placeholder="All categories"
              options={
                categories?.map((c: any) => ({
                  label: c.name,
                  value: c.id,
                })) ?? []
              }
            />
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-ink-faint hover:text-red-600 transition-colors pb-1"
            >
              <X size={13} /> Clear all
            </button>
          )}
        </div>
      )}

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
                      View Details
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
