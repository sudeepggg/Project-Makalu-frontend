import { ChevronLeft, ChevronRight, Filter, Plus, X } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import SearchBar from "../../components/searchBar";
import InputField from "../../components/UncontrolledFields/InputField";
import SelectField from "../../components/UncontrolledFields/SelectField";
import { useCustomersTypes } from "../../hooks";
import { useDebounce } from "../../hooks/useDebounce";
import CustomerDetail from "./CustomerDetail";
import CustomerForm from "./CustomerForm";
import { useCustomers, useToggleCustomer } from "./hooks";
import type { Filters } from "./types";



const DEFAULT_FILTERS: Filters = {
  status: "",
  customerTypeId: "",
};

const CustomerList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [cityInput, setCityInput] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedCity = useDebounce(cityInput, 500);

  const { mutate: toggleCustomer } = useToggleCustomer();
  const { data: customerTypes } = useCustomersTypes();

  const activeFilterCount =
    Object.values(filters).filter(Boolean).length + (cityInput ? 1 : 0);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCityInput("");
    setPage(1);
  };

  const {
    data: result,
    isLoading,
    isError,
  } = useCustomers({
    search: debouncedSearch || undefined,
    page,
    isActive:
      filters.status === "active"
        ? true
        : filters.status === "inactive"
          ? false
          : undefined,
    customerTypeId: filters.customerTypeId || undefined,
    city: debouncedCity || undefined,
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

  const handleEdit = (customer: any) => {
    setEditCustomer(customer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditCustomer(null);
  };

  if (isLoading && !debouncedSearch) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="card p-4 text-red-600 text-sm">
        Error loading customers.
      </div>
    );

  if (viewId)
    return <CustomerDetail id={viewId} onBack={() => setViewId(null)} />;

  return (
    <>
      <div className="">
        {/* Toolbar */}
        <div className="mb-4 border-b border-surface-200 flex items-center gap-3">
          <SearchBar
            value={search}
            onClick={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeHolder="Search by name or email…"
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
            <Plus size={16} /> New Customer
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

            {/* Customer Type */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <SelectField
                label="Customer Type"
                value={filters.customerTypeId}
                onChange={(e) => setFilter("customerTypeId", e.target.value)}
                className="py-1.5 text-sm"
                placeholder="All types"
                options={
                  customerTypes?.map((t: any) => ({
                    label: t.name,
                    value: t.id,
                  })) ?? []
                }
              />
            </div>

            {/* City — bound to cityInput so typing is instant */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <InputField
                value={cityInput}
                label="City"
                placeholder="e.g. Kathmandu"
                classname="py-1.5 text-sm"
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setPage(1);
                }}
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

        {/* Active filter pills */}
        {/* {activeFilterCount > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-surface-200">
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                {filters.status === "active" ? "Active" : "Inactive"}
                <button
                  onClick={() => setFilter("status", "")}
                  className="hover:text-primary-900"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {filters.customerTypeId && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                {customerTypes?.find(
                  (t: any) => t.id === filters.customerTypeId,
                )?.name ?? "Type"}
                <button
                  onClick={() => setFilter("customerTypeId", "")}
                  className="hover:text-primary-900"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {cityInput && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                {cityInput}
                <button
                  onClick={() => setCityInput("")}
                  className="hover:text-primary-900"
                >
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        )} */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-base bg-white rounded-md">
            <thead className="bg-primary-600">
              <tr>
                <th className="!text-white">Name</th>
                <th className="!text-white">Type</th>
                <th className="!text-white">City</th>
                <th className="!text-white">Credit Limit</th>
                <th className="!text-white !text-center">Status</th>
                <th className="!text-white !text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-ink-faint py-8">
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
                    <td className="text-center">
                      <ToggleSwitch
                        checked={c.isActive}
                        disabled={isToggling}
                        onChange={() => handleToggle(c.id, c.isActive)}
                        size="sm"
                      />
                    </td>
                    <td
                      align="center"
                      className="flex items-center justify-center gap-2"
                    >
                      <button
                        onClick={() => handleEdit(c)}
                        className="btn-secondary py-1 px-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setViewId(c.id)}
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

        {/* Pagination */}
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
        onClose={handleCloseForm}
        title={editCustomer ? "Edit Customer" : "Add Customer"}
      >
        <CustomerForm customer={editCustomer} onSaved={handleCloseForm} />
      </Modal>
    </>
  );
};

export default CustomerList;
