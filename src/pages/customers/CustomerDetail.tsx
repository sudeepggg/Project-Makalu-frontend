import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useCustomersDetails } from "./hooks";
import type { DetailsProps } from "./types";


const CustomerDetail = ({ id, onBack }: DetailsProps) => {
  const { data: customer, isLoading } = useCustomersDetails(id);

  if (isLoading) return <LoadingSpinner />;
  if (!customer) {
    return (
      <div className="p-8 text-center text-ink-muted">
        <p>Customer profiles could not be found.</p>
      </div>
    );
  }

  // Calculate credit utilization percentage safely
  const creditLimit = customer.creditLimit || 0;
  const creditUsed = customer.creditUsed || 0;
  const creditPercentage =
    creditLimit > 0 ? Math.min((creditUsed / creditLimit) * 100, 100) : 0;
  const isCreditCritical = creditPercentage > 85;

  return (
    <div className=" mx-auto space-y-6 animate-fade-in">
      {/* 1. TOP NAVIGATION & HEADER HERO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-primary tracking-tight">
                {customer.name}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide shadow-sm ${
                  customer.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-ink-muted mt-1 flex items-center gap-1.5">
              <Building2 size={14} />
              {customer.customerType?.name || "Standard Customer"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. CONTACT DETAILS CARD (Left/2-Columns on Wide) */}
        <div className="bg-white border border-surface-200 rounded-xl shadow-sm p-6 md:col-span-2 space-y-6">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
            Contact Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Email Address
                </p>
                {customer.email ? (
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-sm text-primary font-medium hover:underline break-all mt-0.5 block"
                  >
                    {customer.email}
                  </a>
                ) : (
                  <p className="text-sm text-ink-muted italic mt-0.5">—</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mt-0.5">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Phone Line
                </p>
                {customer.phone ? (
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-sm text-primary font-medium hover:underline mt-0.5 block"
                  >
                    {customer.phone}
                  </a>
                ) : (
                  <p className="text-sm text-ink-muted italic mt-0.5">—</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                  City / Location
                </p>
                <p className="text-sm text-ink font-medium mt-0.5">
                  {customer.city || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Payment Terms
                </p>
                <p className="text-sm text-ink font-medium mt-0.5">
                  {customer.paymentTerms || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FINANCIAL ACCOUNTABILITY CARD (Right/1-Column) */}
        <div className="bg-white border border-surface-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-surface-100">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Financial Overview
              </h2>
              <CreditCard size={16} className="text-ink-muted" />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-ink-muted">
                  <span>CREDIT USED</span>
                  <span
                    className={
                      isCreditCritical ? "text-amber-600 font-bold" : ""
                    }
                  >
                    {creditPercentage.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xl font-mono font-bold text-ink mt-1">
                  NPR {creditUsed.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-ink-muted">
                  TOTAL LIMIT
                </p>
                <p className="text-md font-mono font-semibold text-ink-muted mt-0.5">
                  NPR {creditLimit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Micro Progress Bar Component */}
          <div className="mt-6">
            <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isCreditCritical ? "bg-amber-500" : "bg-primary"
                }`}
                style={{ width: `${creditPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT ORDERS BOARD */}
      {customer.orders && customer.orders.length > 0 && (
        <div className="bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-surface-100">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Recent Activity Ledger
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface-50 text-xs font-medium text-ink-muted uppercase tracking-wider border-b border-surface-100">
                <tr>
                  <th className="px-6 py-3.5">Order Id</th>
                  <th className="px-6 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5">Fulfillment</th>
                  <th className="px-6 py-3.5 text-right">Statement Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {customer.orders.map((o: any) => {
                  const statusLower = o.status?.toLowerCase() || "";
                  let badgeColors = "bg-slate-50 text-slate-700";
                  if (
                    statusLower === "delivered" ||
                    statusLower === "completed"
                  ) {
                    badgeColors = "bg-emerald-50 text-emerald-700";
                  } else if (
                    statusLower === "pending" ||
                    statusLower === "processing"
                  ) {
                    badgeColors = "bg-amber-50 text-amber-700";
                  } else if (statusLower === "cancelled") {
                    badgeColors = "bg-rose-50 text-rose-700";
                  }

                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-surface-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-medium text-primary text-xs">
                        {o.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-ink-muted">
                        {new Date(o.orderDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeColors}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-ink">
                        NPR {o.total?.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;
