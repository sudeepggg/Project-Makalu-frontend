import React, { useRef } from "react";
import type { BillType, CompanyInfo, OrderBillProps } from "./types";


const fmt = (v: number) =>
  `NPR ${(v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const dt = (v?: string) =>
  v
    ? new Date(v).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT:      { bg: "#E8E7DF", text: "#5F5E5A" },
  CONFIRMED:  { bg: "#B5D4F4", text: "#0C447C" },
  DISPATCHED: { bg: "#FAC775", text: "#633806" },
  DELIVERED:  { bg: "#C0DD97", text: "#27500A" },
};

const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #order-bill-printable, #order-bill-printable * { visibility: visible !important; }
  #order-bill-printable { position: fixed; inset: 0; padding: 24px; background: #fff; }
  .no-print { display: none !important; }
}
`;


export const COMPANY: CompanyInfo = {
  name: "Your Company Name",
  address: "Kathmandu, Bagmati Province, Nepal",
  phone: "+977-1-XXXXXXX",
  email: "info@company.com",
  pan: "123456789",
  vatNumber: "123456789",
  website: "www.company.com",
};

const BILL_LABELS: Record<BillType, { title: string; accentColor: string; headerBg: string }> = {
  PURCHASE_ORDER: { title: "Purchase Order",  accentColor: "#b8722a", headerBg: "#1a3a6b" },
  TAX_INVOICE:    { title: "Tax Invoice",     accentColor: "#0F6E56", headerBg: "#0d3d2e" },
  REGULAR_BILL:   { title: "Bill / Receipt",  accentColor: "#533AB7", headerBg: "#2A1F6E" },
};

const OrderBill: React.FC<OrderBillProps> = ({
  order,
  company = COMPANY,
  billType = "PURCHASE_ORDER",
  taxRate = 13,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Inject print styles once
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = PRINT_STYLES;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handlePrint = () => window.print();

  const { title, accentColor, headerBg } = BILL_LABELS[billType];
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.DRAFT;

  // Tax calculations (only for TAX_INVOICE)
  const taxableAmount = order.subtotal;
  const taxAmount     = billType === "TAX_INVOICE" ? Math.round(taxableAmount * taxRate) / 100 : 0;
  const grandTotal    = billType === "TAX_INVOICE" ? taxableAmount + taxAmount : order.total;

  const totalDiscount = (order.items ?? []).reduce((sum, it) => {
    const gross = it.unitPrice * it.quantity;
    return sum + (gross - it.lineTotal);
  }, 0);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Toolbar */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={handlePrint}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 8,
            background: headerBg,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          🖨️ Print / Save PDF
        </button>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ✕ Close
          </button>
        )}
        <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>
          Printing as: <strong>{title}</strong>
          {billType === "TAX_INVOICE" && ` · VAT ${taxRate}%`}
        </span>
      </div>

      {/* ── Printable Bill ── */}
      <div
        id="order-bill-printable"
        ref={printRef}
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          maxWidth: 760,
          overflow: "hidden",
          color: "#1a1a1a",
          fontSize: 13,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: headerBg,
            color: "#fff",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{company.name}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>{company.address}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
              {company.phone} · {company.email}
            </div>
            {billType === "TAX_INVOICE" && company.vatNumber && (
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                VAT Reg. No.: {company.vatNumber}
              </div>
            )}
            {billType !== "TAX_INVOICE" && company.pan && (
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                PAN: {company.pan}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 12, opacity: 0.7, fontFamily: "monospace", marginTop: 4 }}>
              {order.orderNumber}
            </div>
            <div
              style={{
                marginTop: 8,
                display: "inline-block",
                background: statusStyle.bg,
                color: statusStyle.text,
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: 999,
                letterSpacing: 0.4,
              }}
            >
              {order.status}
            </div>
          </div>
        </div>

        {/* Accent bar */}
        <div style={{ height: 4, background: accentColor }} />

        {/* Meta row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderBottom: `1px solid #e8e8e8`,
          }}
        >
          {[
            { label: "Date", value: dt(order.orderDate) },
            { label: "Confirmed", value: dt(order.confirmedDate) },
            { label: "Reference No.", value: order.orderNumber },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                padding: "10px 20px",
                borderRight: "1px solid #eee",
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, color: "#888", marginBottom: 3 }}>
                {m.label}
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, fontFamily: m.label === "Reference No." ? "monospace" : "inherit" }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Parties */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ padding: "14px 20px", borderRight: "1px solid #eee" }}>
            <div
              style={{
                background: accentColor,
                color: "#fff",
                display: "inline-block",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                padding: "2px 8px",
                borderRadius: 3,
                marginBottom: 8,
              }}
            >
              {billType === "REGULAR_BILL" ? "Billed To" : "Customer / Ship To"}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {order.customer?.name || "—"}
            </div>
            {order.customer?.address && (
              <div style={{ color: "#666", fontSize: 12 }}>{order.customer.address}</div>
            )}
            {order.customer?.phone && (
              <div style={{ color: "#666", fontSize: 12 }}>📞 {order.customer.phone}</div>
            )}
            {order.customer?.email && (
              <div style={{ color: "#666", fontSize: 12 }}>✉ {order.customer.email}</div>
            )}
            {billType === "TAX_INVOICE" && order.customer?.pan && (
              <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
                Customer PAN: <strong>{order.customer.pan}</strong>
              </div>
            )}
          </div>
          <div style={{ padding: "14px 20px" }}>
            <div
              style={{
                background: accentColor,
                color: "#fff",
                display: "inline-block",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                padding: "2px 8px",
                borderRadius: 3,
                marginBottom: 8,
              }}
            >
              {billType === "REGULAR_BILL" ? "Payment Info" : "Shipped From"}
            </div>
            {billType === "REGULAR_BILL" ? (
              <>
                {(order.payments ?? []).map((p) => (
                  <div key={p.id} style={{ marginBottom: 4 }}>
                    <div style={{ fontWeight: 600 }}>{fmt(p.amount)}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>
                      {p.paymentMethod} · {dt(p.paymentDate)}
                    </div>
                  </div>
                ))}
                {!order.payments?.length && (
                  <div style={{ color: "#aaa", fontSize: 12 }}>No payments recorded</div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600 }}>{company.name}</div>
                <div style={{ color: "#666", fontSize: 12 }}>{company.address}</div>
                {company.phone && (
                  <div style={{ color: "#666", fontSize: 12 }}>📞 {company.phone}</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Items table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: headerBg }}>
                {["S.N.", "SKU", "Description", "Qty", "Unit Price", "Disc %", "Line Total"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        padding: "8px 12px",
                        textAlign: h === "S.N." || h === "Description" || h === "SKU" ? "left" : "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((it, i) => (
                <tr
                  key={it.id}
                  style={{
                    background: i % 2 === 1 ? "#f9f9f9" : "#fff",
                    borderBottom: "0.5px solid #eee",
                  }}
                >
                  <td style={{ padding: "8px 12px", color: "#888", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 11, color: "#666" }}>
                    {it.product?.sku}
                  </td>
                  <td style={{ padding: "8px 12px", fontWeight: 500 }}>{it.product?.name}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>{it.quantity}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace" }}>
                    {fmt(it.unitPrice)}
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>
                    {it.discountPercentage ?? 0}%
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                    {fmt(it.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <div style={{ width: 280, padding: "12px 20px" }}>
            <TotalRow label="Subtotal" value={fmt(order.subtotal)} />
            {totalDiscount > 0 && (
              <TotalRow label="Total Discount" value={`- ${fmt(totalDiscount)}`} muted />
            )}
            {billType === "TAX_INVOICE" && (
              <>
                <TotalRow label="Taxable Amount" value={fmt(taxableAmount)} />
                <TotalRow label={`VAT (${taxRate}%)`} value={fmt(taxAmount)} />
              </>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: `2px solid ${headerBg}`,
                marginTop: 6,
                paddingTop: 6,
                fontSize: 15,
                fontWeight: 700,
                color: headerBg,
              }}
            >
              <span>Grand Total</span>
              <span style={{ fontFamily: "monospace" }}>{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "8px 20px",
            background: "#f5f4f0",
            fontSize: 12,
            color: "#555",
          }}
        >
          <strong>Amount in words:</strong>{" "}
          <em>Refer to total above (NPR)</em>
        </div>

        {/* Signature row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            padding: "20px 24px 16px",
            borderTop: "1px solid #eee",
          }}
        >
          <div>
            <div style={{ height: 40, borderBottom: "1px solid #bbb", marginBottom: 4 }} />
            <div style={{ fontSize: 11, color: "#888" }}>Authorized signature</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{company.name}</div>
          </div>
          <div>
            <div style={{ height: 40, borderBottom: "1px solid #bbb", marginBottom: 4 }} />
            <div style={{ fontSize: 11, color: "#888" }}>Received by</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{order.customer?.name || "Customer"}</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: headerBg,
            color: "rgba(255,255,255,0.8)",
            padding: "8px 20px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          <span>Thank you for your business!</span>
          {company.website && <span>{company.website}</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Small helper ─────────────────────────────────────────────────────────────

const TotalRow: React.FC<{ label: string; value: string; muted?: boolean }> = ({
  label,
  value,
  muted,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      padding: "3px 0",
      color: muted ? "#888" : "#333",
    }}
  >
    <span>{label}</span>
    <span style={{ fontFamily: "monospace" }}>{value}</span>
  </div>
);

export default OrderBill;

// ─── Usage example ────────────────────────────────────────────────────────────
//
// import OrderBill from "./OrderBill";
//
// // In your OrderDetail component, add a state + buttons:
// const [billType, setBillType] = React.useState<BillType | null>(null);
//
// const COMPANY = {
//   name: "My Company Pvt. Ltd.",
//   address: "New Baneshwor, Kathmandu, Nepal",
//   phone: "+977-1-4XXXXXX",
//   email: "info@mycompany.com.np",
//   pan: "600XXXXXX",
//   vatNumber: "600XXXXXX",
//   website: "www.mycompany.com.np",
// };
//
// {/* Trigger buttons – add these to your action buttons row in OrderDetail */}
// <button onClick={() => setBillType("PURCHASE_ORDER")} className="btn-secondary">
//   Purchase Order
// </button>
// <button onClick={() => setBillType("TAX_INVOICE")} className="btn-secondary">
//   Tax Invoice
// </button>
// <button onClick={() => setBillType("REGULAR_BILL")} className="btn-secondary">
//   Bill
// </button>
//
// {/* Render – can be a modal or separate route */}
// {billType && order && (
//   <div className="fixed inset-0 bg-black/40 z-50 overflow-auto p-6">
//     <div className="max-w-3xl mx-auto">
//       <OrderBill
//         order={order}
//         company={COMPANY}
//         billType={billType}
//         taxRate={13}
//         onClose={() => setBillType(null)}
//       />
//     </div>
//   </div>
// )}