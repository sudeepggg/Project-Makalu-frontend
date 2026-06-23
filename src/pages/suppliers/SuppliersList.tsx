import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useSuppliers, useToggleSupplier } from "./hooks";
import SupplierDetail from "./SuppliersDetail";
import ToggleSwitch from "../../components/common/ToggleSwitch";

const SuppliersList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const { mutate: toggleSupplier } = useToggleSupplier();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: result,
    isLoading,
    isError,
  } = useSuppliers({
    search: debouncedSearch || undefined,
    page,
  });

  const suppliers = result?.data || [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  const handleToggle = (id: string, isActive: boolean) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    toggleSupplier(
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
        Error loading suppliers.
      </div>
    );

  if (selectedId)
    return (
      <SupplierDetail id={selectedId} onBack={() => setSelectedId(null)} />
    );

  return (
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
              <th>Contact Person</th>
              <th>City</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-ink-faint py-8">
                  No suppliers found
                </td>
              </tr>
            )}
            {suppliers.map((s: any) => {
              const isToggling = togglingIds.has(s.id);

              return (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-ink-muted">{s.contactPerson || "—"}</td>
                  <td className="text-ink-muted">{s.city || "—"}</td>
                  <td className="text-ink-muted">{s.phone || "—"}</td>
                  <td>
                    <ToggleSwitch
                      checked={s.isActive}
                      disabled={isToggling}
                      onChange={() => handleToggle(s.id, s.isActive)}
                      size="sm"
                    />
                  </td>
                  <td className="flex items-center gap-2">
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowForm(true);
                        // setSelectedId(c.id);
                      }}
                      className="btn-secondary py-1 px-2"
                    >
                      EDIT
                    </button> */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(s.id);
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
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between text-sm text-ink-muted">
          <span>
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
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
    </div>
  );
};
export default SuppliersList;
