import { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useCustomers } from "../customers/hooks";
import { usePaymentList } from "./hooks";
import {
  PAYMENT_STATUSES,
  type PaymentFilters,
  type PaymentListResponse,
} from "./types";
import SelectField from "../../components/ContolledFields/SelectField";
import PaymentDetail from "./PaymentDetail";
import { RecordPaymentForm } from "./PaymentForm";
import Modal from "./Modal";


const STATUS_OPTIONS = Object.values(PAYMENT_STATUSES).map((s) => ({
  value: s,
  label: s,
}));

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const Payment = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [viewPaymentId, setViewPaymentId] = useState<string | null>(null);

  const filterFormMethods = useForm<PaymentFilters>({
    defaultValues: { status: undefined, customerId: undefined },
  });

  const { control } = filterFormMethods;
  const watchedStatus = useWatch({ control, name: "status" });
  const watchedCustomerId = useWatch({ control, name: "customerId" });

  const currentFilters: PaymentFilters = {
    status: watchedStatus || undefined,
    customerId: watchedCustomerId || undefined,
  };

  const { data: paymentResponse, isLoading, isError } = usePaymentList({
    page,
    limit,
    filters: currentFilters,
  });

  const { data: customers } = useCustomers();

  useEffect(() => {
    setPage(1);
  }, [watchedStatus, watchedCustomerId]);

  const customerOptions =
    customers?.data?.map((c: any) => ({ value: c.id, label: c.name })) ?? [];

  const res = paymentResponse as PaymentListResponse | undefined;
  const payments = res?.data.data ?? [];
  const pagination = res?.pagination ?? { page: 1, limit: 20, total: 0, pages: 1 };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <button
          onClick={() => setShowRecordModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Record Payment
        </button>
      </div>

      {/* Filters */}
      <FormProvider {...filterFormMethods}>
        <div className="flex gap-4 mb-6">
          <div className="w-48">
            <SelectField
              name="status"
              label="Status"
              options={STATUS_OPTIONS}
              placeholder="All statuses"
            />
          </div>
          <div className="w-64">
            <SelectField
              name="customerId"
              label="Customer"
              options={customerOptions}
              placeholder="All customers"
            />
          </div>
        </div>
      </FormProvider>

      {/* States */}
      {isLoading && (
        <p className="text-gray-400 text-sm py-8 text-center">Loading payments…</p>
      )}
      {isError && (
        <p className="text-red-500 text-sm py-8 text-center">Could not load payments.</p>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  {["Date", "Customer", "Order", "Amount", "Method", "Status", ""].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No payments match these filters.
                    </td>
                  </tr>
                )}
                {payments.map((payment: any) => {
                  const statusKey = payment.status?.toLowerCase();
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {payment.customer?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {payment.order?.orderNumber ?? payment.orderId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{payment.method}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[statusKey] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewPaymentId(payment.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {Math.max(1, pagination.pages)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.pages}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Record Payment Modal */}
      {showRecordModal && (
        <Modal title="Record Payment" onClose={() => setShowRecordModal(false)}>
          <RecordPaymentForm onSuccess={() => setShowRecordModal(false)} />
        </Modal>
      )}

      {/* View Detail Modal */}
      {viewPaymentId && (
        <Modal title="Payment Detail" onClose={() => setViewPaymentId(null)}>
          <PaymentDetail id={viewPaymentId} />
        </Modal>
      )}
    </div>
  );
};

export default Payment;