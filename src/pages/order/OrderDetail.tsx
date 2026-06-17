import { ArrowLeft, Printer } from "lucide-react";
import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useConfirmOrder, useOrdersDetails } from "./hooks";
import type { BillType } from "./types";
import OrderBill, { COMPANY } from "./OrderBill";

const fmt = (v: number) => `NPR ${v?.toLocaleString() ?? 0}`;
const dt = (v?: string) =>
  v
    ? new Date(v).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const statusColors: Record<string, string> = {
  DRAFT: "badge-draft",
  CONFIRMED: "badge-confirmed",
  DISPATCHED: "badge-dispatched",
  DELIVERED: "badge-delivered",
};

const OrderDetail: React.FC<{ id: string; onBack?: () => void }> = ({
  id,
  onBack,
}) => {
  const [billType, setBillType] = React.useState<BillType | null>(null);

  const { mutate: confirmOrder, isPending: confirmPending } =
    useConfirmOrder(id);
  const { data: order, isLoading } = useOrdersDetails(id);

  if (isLoading) return <LoadingSpinner />;
  if (!order) return null;

  const actions: {
    status: string;
    action: string;
    label: string;
    pendingLabel: string;
    cls: string;
  }[] = [
    {
      status: "DRAFT",
      action: "confirm",
      label: "Confirm",
      pendingLabel: "Confirming…",
      cls: "btn-primary",
    },
    {
      status: "CONFIRMED",
      action: "dispatch",
      label: "Dispatch",
      pendingLabel: "Dispatching…",
      cls: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-all disabled:opacity-50",
    },
    {
      status: "DISPATCHED",
      action: "deliver",
      label: "Mark Delivered",
      pendingLabel: "Delivering…",
      cls: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all disabled:opacity-50",
    },
  ];

  const printButtons: { type: BillType; label: string }[] = [
    { type: "PURCHASE_ORDER", label: "Purchase Order" },
    { type: "TAX_INVOICE",    label: "Tax Invoice"    },
    { type: "REGULAR_BILL",   label: "Bill"           },
  ];

  return (
    <>
      {/* ── Bill print overlay ── */}
      {billType && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-black/50 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBillType(null);
          }}
        >
          <div className="max-w-3xl mx-auto">
            <OrderBill
              order={order}
              company={COMPANY}
              billType={billType}
              taxRate={13}
              onClose={() => setBillType(null)}
            />
          </div>
        </div>
      )}

      {/* ── Main detail view ── */}
      <div className="space-y-4 fade-in w-full h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="btn-secondary py-1.5 px-2">
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <h2 className="font-display text-2xl text-primary">
                {order.orderNumber}
              </h2>
              <p className="text-sm text-ink-faint">
                Placed {dt(order.orderDate)}
              </p>
            </div>
            <span className={statusColors[order.status] || "badge-draft"}>
              {order.status}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Print buttons */}
            {printButtons.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setBillType(type)}
                className="btn-secondary inline-flex items-center gap-1.5 py-1.5 px-3 text-sm"
              >
                <Printer size={14} />
                {label}
              </button>
            ))}

            {/* Status-action buttons */}
            {actions
              .filter((a) => a.status === order.status)
              .map((a) => (
                <button
                  key={a.action}
                  onClick={() => confirmOrder(a.action)}
                  disabled={confirmPending}
                  className={a.cls}
                >
                  {confirmPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {a.pendingLabel}
                    </>
                  ) : (
                    a.label
                  )}
                </button>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold text-ink">Order Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((it: any) => (
                    <tr key={it.id}>
                      <td className="font-mono text-xs text-ink-muted">
                        {it.product?.sku}
                      </td>
                      <td className="font-medium">{it.product?.name}</td>
                      <td>{it.quantity}</td>
                      <td className="font-mono">{fmt(it.unitPrice)}</td>
                      <td>{it.discountPercentage ?? 0}%</td>
                      <td className="font-mono font-semibold">
                        {fmt(it.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex justify-end border-t border-surface-200">
              <div className="text-right space-y-1">
                <div className="text-sm text-ink-muted">
                  Subtotal:{" "}
                  <span className="font-mono">{fmt(order.subtotal)}</span>
                </div>
                <div className="text-lg font-semibold text-primary">
                  Total: <span className="font-mono">{fmt(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-4 space-y-3">
              <h4 className="font-semibold text-ink">Customer</h4>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.customer?.name}</p>
                <p className="text-ink-muted">{order.customer?.email || "—"}</p>
                <p className="text-ink-muted">{order.customer?.phone || "—"}</p>
              </div>
            </div>
            <div className="card p-4 space-y-2">
              <h4 className="font-semibold text-ink">Timeline</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-ink-faint">Placed:</span>{" "}
                  {dt(order.orderDate)}
                </p>
                {order.confirmedDate && (
                  <p>
                    <span className="text-ink-faint">Confirmed:</span>{" "}
                    {dt(order.confirmedDate)}
                  </p>
                )}
                {order.dispatchedDate && (
                  <p>
                    <span className="text-ink-faint">Dispatched:</span>{" "}
                    {dt(order.dispatchedDate)}
                  </p>
                )}
                {order.deliveredDate && (
                  <p>
                    <span className="text-ink-faint">Delivered:</span>{" "}
                    {dt(order.deliveredDate)}
                  </p>
                )}
              </div>
            </div>
            {order.payments?.length > 0 && (
              <div className="card p-4 space-y-2">
                <h4 className="font-semibold text-ink">Payments</h4>
                {order.payments.map((p: any) => (
                  <div
                    key={p.id}
                    className="text-sm border border-surface-200 rounded-lg p-3"
                  >
                    <p className="font-mono font-semibold">{fmt(p.amount)}</p>
                    <p className="text-ink-muted">
                      {p.paymentMethod} · {dt(p.paymentDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;