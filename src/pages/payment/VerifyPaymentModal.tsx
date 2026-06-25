import { useState } from "react";
import Modal from "./Modal";
import { useCreatePayment } from "./hooks";
import { PAYMENT_METHODS } from "./types";

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
  COMPLETED: { bg: "bg-green-50 text-green-700 border-green-200", label: "Paid" },
  FAILED: { bg: "bg-red-50 text-red-700 border-red-200", label: "Failed" },
};

const PAYMENT_STATUS_STYLE: Record<string, string> = {
  UNPAID: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PARTIALLY_PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
};

export function VerifyPaymentModal({ order, onClose }: Props) {
  const completedTotal = order.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((s, p) => s + p.amount, 0);

  const outstanding = Math.max(0, order.total - completedTotal);

  const [amount, setAmount] = useState<number>(outstanding);
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0]?.value ?? "CASH");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const createPayment = useCreatePayment();

  const fmt = (n: number) =>
    `${order.currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return;
    await createPayment.mutateAsync({
      customerId: order.customerId,
      orderId: order.id,
      amount,
      paymentMethod: method,
      reference: reference || undefined,
      paymentDate: date,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal title="" onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <i className="ti ti-receipt text-blue-600 text-lg" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{order.orderNumber}</p>
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

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Order total", value: fmt(order.total), color: "text-gray-800" },
          { label: "Total paid", value: fmt(completedTotal), color: "text-green-600" },
          { label: "Outstanding", value: fmt(outstanding), color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">{label}</p>
            <p className={`text-sm font-medium ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* New payment form */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          New payment
        </p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Amount ({order.currency})</label>
            <input
              type="number"
              step="0.01"
              min={0}
              max={outstanding}
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Payment date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Reference <span className="opacity-60">(optional)</span></label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Cheque no., txn ID…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Notes <span className="opacity-60">(optional)</span></label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal remark…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Past payments */}
      {order.payments.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Payment history
          </p>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_90px_80px_80px] bg-gray-50 px-3 py-2 border-b border-gray-100">
              {["Date / method", "Amount", "Status", "Reference"].map((h) => (
                <p key={h} className="text-[11px] uppercase tracking-wide text-gray-400 m-0">{h}</p>
              ))}
            </div>
            {order.payments.map((p, i) => {
              const st = STATUS_STYLE[p.status] ?? STATUS_STYLE.COMPLETED;
              return (
                <div
                  key={p.id}
                  className={`grid grid-cols-[1fr_90px_80px_80px] items-center px-3 py-2.5 ${i < order.payments.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <i className={`ti ${METHOD_ICONS[p.paymentMethod] ?? "ti-credit-card"} text-gray-400 text-sm`} aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-800">
                        {p.paymentMethod.charAt(0) + p.paymentMethod.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(p.paymentDate).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{fmt(p.amount)}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border w-fit ${st.bg}`}>
                    {st.label}
                  </span>
                  <p className="text-xs text-gray-400 font-mono">{p.transactionId ?? "—"}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createPayment.isPending || amount <= 0 || amount > outstanding}
          className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {createPayment.isPending ? "Saving..." : "Record Payment"}
        </button>
      </div>
    </Modal>
  );
}