import { ArrowLeft } from "lucide-react";
import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useSupplierDetails } from "./hooks";

const SupplierDetail: React.FC<{ id: string; onBack?: () => void }> = ({
  id,
  onBack,
}) => {
  const { data: supplier, isLoading } = useSupplierDetails(id);

  if (isLoading) return <LoadingSpinner />;
  if (!supplier) return null;

  return (
    <div className="card fade-in">
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-secondary py-1.5 px-2">
            <ArrowLeft size={16} />
          </button>
        )}
        <h3 className="font-display text-xl text-primary">{supplier.name}</h3>
        <span className={supplier.isActive ? "badge-active" : "badge-inactive"}>
          {supplier.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <p className="form-label">Contact Person</p>
            <p className="text-sm text-ink">{supplier.contactPerson || "—"}</p>
          </div>
          <div>
            <p className="form-label">Email</p>
            <p className="text-sm text-ink">{supplier.email || "—"}</p>
          </div>
          <div>
            <p className="form-label">Phone</p>
            <p className="text-sm text-ink">{supplier.phone || "—"}</p>
          </div>
          <div>
            <p className="form-label">City</p>
            <p className="text-sm text-ink">{supplier.city || "—"}</p>
          </div>
          <div>
            <p className="form-label">State</p>
            <p className="text-sm text-ink">{supplier.state || "—"}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="form-label">Street</p>
            <p className="text-sm text-ink">{supplier.street || "—"}</p>
          </div>
          <div>
            <p className="form-label">Zip Code</p>
            <p className="text-sm text-ink">{supplier.zipCode || "—"}</p>
          </div>
          <div>
            <p className="form-label">Country</p>
            <p className="text-sm text-ink">{supplier.country || "—"}</p>
          </div>
          <div>
            <p className="form-label">Registration Number</p>
            <p className="text-sm text-ink">
              {supplier.registrationNumber || "—"}
            </p>
          </div>
          <div>
            <p className="form-label">Payment Terms</p>
            <p className="text-sm text-ink">{supplier.paymentTerms || "—"}</p>
          </div>
        </div>
      </div>
      {supplier.purchases?.length > 0 && (
        <div className="border-t border-surface-200 p-5">
          <p className="form-label mb-3">Recent Purchases</p>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>PO #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {supplier.purchases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-ink-faint py-8">
                      No purchases found
                    </td>
                  </tr>
                )}
                {supplier.purchases.map((p: any) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.poNumber}</td>
                    <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge-${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="font-mono">
                      NPR {p.total?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default SupplierDetail;
