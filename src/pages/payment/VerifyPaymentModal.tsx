import { useState } from "react";
import Modal from "./Modal";
import { useVerifyPayment } from "./hooks";
import { PAYMENT_METHODS } from "./types";

type VerifyStatus = "COMPLETED" | "FAILED";

interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  notes: string;
  paymentDate: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  customerId: string;
  customer: { name: string; city: string };
  payments: Payment[];
  totalPaid: number;
  paymentStatus: string;
}

interface Props {
  order: Order;
  onClose: () => void;
}

const METHOD_ICONS: Record<string, string> = {
  CASH: "ti-cash",
  CHEQUE: "ti-file-invoice",
  ONLINE: "ti-device-mobile",
  OTHER: "ti-dots-circle-horizontal",
};

const STATUS_STYLE: Record<string, { bg: string; label: string }> = {
  COMPLETED: {
    bg: "bg-green-50 text-green-700 border-green-200",
    label: "Completed",
  },
  PENDING: {
    bg: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Pending",
  },
  FAILED: { bg: "bg-red-50 text-red-700 border-red-200", label: "Failed" },
};

const PAYMENT_STATUS_STYLE: Record<string, string> = {
  UNPAID: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PARTIALLY_PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
};

export function VerifyPaymentModal({ order, onClose }: Props) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<VerifyStatus | null>(
    null,
  );
  const [verifyNote, setVerifyNote] = useState("");

  const [editAmount, setEditAmount] = useState<Record<string, number>>({});
  const [editMethod, setEditMethod] = useState<Record<string, string>>({});
  const [editDate, setEditDate] = useState<Record<string, string>>({});

  const verifyPayment = useVerifyPayment();

  const fmt = (n: number) =>
    `${order.currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const completedTotal = order.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((s, p) => s + p.amount, 0);

  const pendingTotal = order.payments
    .filter((p) => p.status === "PENDING")
    .reduce((s, p) => s + p.amount, 0);

  const outstanding = Math.max(0, order.total - completedTotal);

  const handleSelectPayment = (p: Payment) => {
    const isSelected = selectedPaymentId === p.id;
    if (isSelected) {
      setSelectedPaymentId(null);
      setSelectedStatus(null);
      setVerifyNote("");
    } else {
      setSelectedPaymentId(p.id);
      setSelectedStatus(null);
      setVerifyNote("");
      setEditAmount((prev) => ({ ...prev, [p.id]: prev[p.id] ?? p.amount }));
      setEditMethod((prev) => ({
        ...prev,
        [p.id]: prev[p.id] ?? p.paymentMethod,
      }));
      setEditDate((prev) => ({
        ...prev,
        [p.id]:
          prev[p.id] ?? new Date(p.paymentDate).toISOString().split("T")[0],
      }));
    }
  };

  const handleVerify = async (p: Payment) => {
    if (!selectedStatus) return;
    await verifyPayment.mutateAsync({
      id: p.id,
      orderId: p.orderId,
      customerId: p.customerId,
      status: selectedStatus,
      verifyNote,
      amount: editAmount[p.id] ?? p.amount,
      paymentMethod: editMethod[p.id] ?? p.paymentMethod,
      paymentDate:
        editDate[p.id] ?? new Date(p.paymentDate).toISOString().split("T")[0],
    });
    setSelectedPaymentId(null);
    setSelectedStatus(null);
    setVerifyNote("");
  };

  return (
    <Modal title="" onClose={onClose}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center">
            <i
              className="ti ti-receipt text-yellow-600 text-lg"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {order.orderNumber}
            </p>
            <p className="text-xs text-gray-400">
              {order.customer.name} · {order.customer.city}
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${PAYMENT_STATUS_STYLE[order.paymentStatus] ?? ""}`}
        >
          {order.paymentStatus.replace("_", " ")}
        </span>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          {
            label: "Order total",
            value: fmt(order.total),
            color: "text-gray-800",
          },
          {
            label: "Total paid",
            value: fmt(completedTotal),
            color: "text-green-600",
          },
          {
            label: "Pending",
            value: fmt(pendingTotal),
            color: "text-yellow-600",
          },
          {
            label: "Outstanding",
            value: fmt(outstanding),
            color: "text-red-500",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
              {label}
            </p>
            <p className={`text-sm font-medium ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Order + Customer info row ── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
            Order ID
          </p>
          <p className="text-xs font-mono text-gray-700">{order.id}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
            Customer ID
          </p>
          <p className="text-xs font-mono text-gray-700">{order.customerId}</p>
        </div>
      </div>

      {/* ── Payment records table ── */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          Payment records
        </p>

        <div className="border border-gray-100 rounded-lg overflow-hidden">
          {/* table header */}
          <div className="grid grid-cols-[1fr_90px_90px_80px_28px] bg-gray-50 px-3 py-2 border-b border-gray-100">
            {["Date / method", "Amount", "Status", "Reference", ""].map((h) => (
              <p
                key={h}
                className="text-[11px] uppercase tracking-wide text-gray-400 m-0"
              >
                {h}
              </p>
            ))}
          </div>

          {order.payments.length === 0 ? (
            <div className="py-8 text-center">
              <i
                className="ti ti-inbox text-2xl text-gray-300"
                aria-hidden="true"
              />
              <p className="text-sm text-gray-400 mt-2">
                No payments recorded yet
              </p>
            </div>
          ) : (
            order.payments.map((p, i) => {
              const st = STATUS_STYLE[p.status] ?? STATUS_STYLE.PENDING;
              const isPending = p.status === "PENDING";
              const isSelected = selectedPaymentId === p.id;

              const amt = editAmount[p.id] ?? p.amount;
              const method = editMethod[p.id] ?? p.paymentMethod;
              const date =
                editDate[p.id] ??
                new Date(p.paymentDate).toISOString().split("T")[0];

              return (
                <div key={p.id}>
                  {/* ── row ── */}
                  <div
                    onClick={() => isPending && handleSelectPayment(p)}
                    className={`grid grid-cols-[1fr_90px_90px_80px_28px] items-center px-3 py-2.5 transition-colors
                      ${i < order.payments.length - 1 || isSelected ? "border-b border-gray-100" : ""}
                      ${isPending ? "cursor-pointer hover:bg-gray-50" : ""}
                      ${isSelected ? "bg-gray-50" : ""}`}
                  >
                    {/* date / method */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <i
                          className={`ti ${METHOD_ICONS[p.paymentMethod] ?? "ti-credit-card"} text-gray-400 text-sm`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {p.paymentMethod.charAt(0) +
                            p.paymentMethod.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(p.paymentDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-gray-800">
                      {fmt(p.amount)}
                    </p>

                    <div>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${st.bg}`}
                      >
                        {st.label}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-mono">
                      {p.transactionId ?? "—"}
                    </p>

                    <div className="flex justify-center">
                      {isPending ? (
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                      ) : (
                        <i
                          className="ti ti-circle-check text-green-500 text-sm"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>

                  {/* ── inline expand panel ── */}
                  {isSelected && (
                    <div className="border-t border-gray-100 bg-gray-50 px-3 py-4">
                      {/* editable fields: amount · method · date */}
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                        Payment details
                      </p>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* amount */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-500">
                            Amount ({order.currency})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            max={outstanding + p.amount} // allow up to outstanding + own amount
                            value={amt || ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditAmount((prev) => ({
                                ...prev,
                                [p.id]: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        {/* method */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-500">
                            Method
                          </label>
                          <select
                            value={method}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditMethod((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {PAYMENT_METHODS.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* date */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-500">
                            Payment date
                          </label>
                          <input
                            type="date"
                            value={date}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setEditDate((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* read-only detail cards */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                          { label: "Order", value: order.orderNumber },
                          { label: "Customer", value: order.customer.name },
                          ...(p.transactionId
                            ? [
                                {
                                  label: "Transaction ID",
                                  value: p.transactionId,
                                  mono: true,
                                  span2: true,
                                },
                              ]
                            : []),
                          ...(p.notes
                            ? [{ label: "Notes", value: p.notes, span2: true }]
                            : []),
                        ].map(({ label, value, mono, span2 }: any) => (
                          <div
                            key={label}
                            className={`bg-white border border-gray-100 rounded-lg p-3 ${span2 ? "col-span-2" : ""}`}
                          >
                            <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                              {label}
                            </p>
                            <p
                              className={`text-sm font-medium text-gray-800 ${mono ? "font-mono text-xs" : ""}`}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* verify buttons */}
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        <i
                          className="ti ti-shield-check text-sm mr-1.5 align-[-1px]"
                          aria-hidden="true"
                        />
                        Verify payment
                        <span className="ml-1.5 font-mono text-xs text-gray-400">
                          {p.transactionId ?? p.id.slice(0, 8)}
                        </span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {(["COMPLETED", "FAILED"] as VerifyStatus[]).map(
                          (s) => {
                            const isGood = s === "COMPLETED";
                            const isChosen = selectedStatus === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStatus(isChosen ? null : s);
                                }}
                                className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                                  isChosen
                                    ? isGood
                                      ? "border-green-300 bg-green-50"
                                      : "border-red-300 bg-red-50"
                                    : "border-gray-100 hover:border-gray-200"
                                }`}
                              >
                                <div
                                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    isChosen
                                      ? isGood
                                        ? "border-green-500 bg-green-500"
                                        : "border-red-500 bg-red-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isChosen && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={`text-sm font-medium mb-0.5 ${isChosen ? (isGood ? "text-green-700" : "text-red-700") : "text-gray-700"}`}
                                  >
                                    {isGood ? "Completed" : "Failed"}
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    {isGood
                                      ? "Payment received & confirmed"
                                      : "Bounced or rejected"}
                                  </p>
                                </div>
                              </button>
                            );
                          },
                        )}
                      </div>

                      {selectedStatus && (
                        <div className="flex flex-col gap-1.5 mb-3">
                          <label className="text-xs text-gray-400">
                            Verification note{" "}
                            <span className="opacity-60">(optional)</span>
                          </label>
                          <textarea
                            rows={2}
                            value={verifyNote}
                            onChange={(e) => setVerifyNote(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Internal remark..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {selectedStatus && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleVerify(p)}
                            disabled={verifyPayment.isPending}
                            className={`px-5 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                              selectedStatus === "COMPLETED"
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {verifyPayment.isPending
                              ? "Saving..."
                              : "Save verification"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-end pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
