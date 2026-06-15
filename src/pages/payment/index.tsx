import { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomers } from "../customers/hooks";
import { usePaymentList } from "./hooks";
import { PAYMENT_STATUSES, type PaymentFilters } from "./types";

const STATUS_OPTIONS = Object.values(PAYMENT_STATUSES).map((s) => ({
  value: s,
  label: s,
}));

export function Payment() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PaymentFilters>({});

  const { data: paymentList, isLoading, isError } = usePaymentList();
  const { data: customers } = useCustomers();
  

  const customerOptions =
    customers?.data?.map((c) => ({ value: c.id, label: c.name })) ?? [];

  return (
    <div className="payment-list">
      <div className="payment-list__header">
        <h1>Payments</h1>
        <Link to="/payments/new" className="button button--primary">
          Record payment
        </Link>
      </div>

      {/* <div className="payment-list__filters">
        <div className="form-field">
          <label htmlFor="status-filter">Status</label>
          <SelectField
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((opt) => opt.value === filters.status) ?? null}
            onChange={(opt) => {
              setFilters((f) => ({ ...f, status: (opt?.value as PaymentStatus) ?? undefined }));
              setPage(1);
            }}
            placeholder="All statuses"
            isClearable
          />
        </div>

        <div className="form-field">
          <label htmlFor="customer-filter">Customer</label>
          <SelectField
            inputId="customer-filter"
            options={customerOptions}
            value={customerOptions.find((opt) => opt.value === filters.customerId) ?? null}
            onChange={(opt) => {
              setFilters((f) => ({ ...f, customerId: opt?.value ?? undefined }));
              setPage(1);
            }}
            placeholder="All customers"
            isClearable
          />
        </div>
      </div> */}

      {isLoading && <p>Loading payments…</p>}
      {isError && <p className="form-error">Could not load payments.</p>}

      {paymentList && (
        <>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paymentList.length === 0 && (
                <tr>
                  <td colSpan={7}>No payments match these filters.</td>
                </tr>
              )}
              {paymentList.map((payment: any) => (
                <tr key={payment.id}>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>{payment.customer?.name ?? "—"}</td>
                  <td>
                    {payment.order?.orderNumber ?? payment.orderId.slice(0, 8)}
                  </td>
                  <td>{payment.amount.toFixed(2)}</td>
                  <td>{payment.method}</td>
                  <td>
                    <span
                      className={`status-badge status-badge--${payment.status.toLowerCase()}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/payments/${payment.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {paymentList.pagination.page} of{" "}
              {Math.max(1, paymentList.pagination.pages)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= paymentList.pagination.pages}
            >
              Next
            </button>
          </div> */}
        </>
      )}
    </div>
  );
}
