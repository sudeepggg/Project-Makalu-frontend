import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import CustomerDetail from "./CustomerDetail";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useCustomers, useToggleCustomer } from "./hooks";
import CustomerForm from "./CustomerForm";
import Modal from "../../components/common/Modal";
import ToggleSwitch from "../../components/common/ToggleSwitch";

const CustomerList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const { mutate: toggleCustomer } = useToggleCustomer();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: result,
    isLoading,
    isError,
  } = useCustomers({
    search: debouncedSearch || undefined,
    page,
  });

  const customers = result?.data || [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleToggle = (id: string, isActive: boolean) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    toggleCustomer(
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

  if (isLoading && !debouncedSearch) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="card p-4 text-red-600 text-sm">
        Error loading customers.
      </div>
    );

  if (selectedId)
    return (
      <CustomerDetail id={selectedId} onBack={() => setSelectedId(null)} />
    );

  return (
    <>
      <div className="card fade-in">
        <div className="p-4 border-b border-surface-200 flex items-center gap-3">
          <div className="relative flex-1">
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
              placeholder="Search by name or email…"
              className="form-field pl-9 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>City</th>
                <th>Credit Limit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-ink-faint py-8">
                    No customers found
                  </td>
                </tr>
              )}
              {customers.map((c: any) => {
                const isToggling = togglingIds.has(c.id);
                return (
                  <tr key={c.id}>
                    <td className="font-medium">{c.name}</td>
                    <td className="text-ink-muted">{c.customerType?.name}</td>
                    <td className="text-ink-muted">{c.city || "—"}</td>
                    <td className="font-mono text-sm">
                      NPR {c.creditLimit?.toLocaleString()}
                    </td>
                    <td>
                      <ToggleSwitch
                        checked={c.isActive}
                        disabled={isToggling}
                        onChange={() => handleToggle(c.id, c.isActive)}
                        size="sm"
                      />
                    </td>
                    <td className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowForm(true);
                          // setSelectedId(c.id);
                        }}
                        className="btn-secondary py-1 px-2"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(c.id);
                        }}
                        className="btn-secondary py-1 px-2"
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
        {pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-surface-200 flex items-center justify-between text-sm text-ink-muted">
            <span>
              Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
              total)
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
      </div>
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Update Customer"
      >
        <CustomerForm
          customers={customers}
          onSaved={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
};
export default CustomerList;
