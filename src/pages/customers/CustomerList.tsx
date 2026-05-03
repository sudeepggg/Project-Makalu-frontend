import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import CustomerDetail from "./CustomerDetail";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CustomerList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
  const pagination = result?.pagination;

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
            {customers.map((c: any) => (
              <tr
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="cursor-pointer"
              >
                <td className="font-medium">{c.name}</td>
                <td className="text-ink-muted">{c.customerType?.name}</td>
                <td className="text-ink-muted">{c.city || "—"}</td>
                <td className="font-mono text-sm">
                  NPR {c.creditLimit?.toLocaleString()}
                </td>
                <td>
                  <span
                    className={c.isActive ? "badge-active" : "badge-inactive"}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
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
  );
};
export default CustomerList;
