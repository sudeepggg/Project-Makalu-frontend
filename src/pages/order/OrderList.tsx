import { ChevronLeft, ChevronRight, Filter, Plus, X } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/searchBar";
import SelectField from "../../components/UncontrolledFields/SelectField";
import { useDebounce } from "../../hooks/useDebounce";
import { useOrders } from "./hooks";
import OrderForm from "./OrderForm";

const statusColors: Record<string, string> = {
  DRAFT: "badge-draft",
  CONFIRMED: "badge-confirmed",
  DISPATCHED: "badge-dispatched",
  DELIVERED: "badge-delivered",
};

const OrderList: React.FC<{ onSelect?: (id: string) => void }> = ({
  onSelect,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editOrder, setEditOrder] = useState<any | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const activeFilterCount = statusFilter ? 1 : 0;

  const clearFilters = () => {
    setStatusFilter("");
    setPage(1);
  };

  const { data: result, isLoading } = useOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
  });

  const orders = result?.data || [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="card">
      {/* Toolbar */}
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        <SearchBar
          value={search}
          onClick={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeHolder="Search by order number or customer…"
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

        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="px-4 py-3 border-b border-surface-200 bg-surface-50 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 min-w-[160px]">
            <SelectField
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="py-1.5 text-sm"
              placeholder="All statuses"
              options={["DRAFT", "CONFIRMED", "DISPATCHED", "DELIVERED"].map(
                (s) => ({
                  label: s,
                  value: s,
                }),
              )}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-ink-faint py-8">
                  No orders found
                </td>
              </tr>
            )}
            {orders.map((o: any) => (
              <tr key={o.id} className={onSelect ? "cursor-pointer" : ""}>
                <td className="font-mono text-xs">{o.orderNumber}</td>
                <td className="font-medium">{o.customer?.name}</td>
                <td className="text-ink-muted">
                  {new Date(o.orderDate).toLocaleDateString()}
                </td>
                <td className="font-mono text-sm">
                  NPR {o.total?.toLocaleString()}
                </td>
                <td>
                  <span className={statusColors[o.status] || "badge-draft"}>
                    {o.status}
                  </span>
                </td>
                <td className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditOrder(o);
                      setShowForm(true);
                    }}
                    className="btn-secondary py-1 px-2"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.(o.id);
                    }}
                    className="btn-secondary py-1 px-2"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between text-sm text-ink-muted">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
            orders)
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
              disabled={page >= pagination.pages}
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
        onClose={() => {
          setShowForm(false);
          setEditOrder(null);
        }}
        title={editOrder ? "Edit Order" : "Add Order"}
      >
        <OrderForm
          order={editOrder}
          onSaved={() => {
            setShowForm(false);
            setEditOrder(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default OrderList;
