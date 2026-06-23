import LoadingSpinner from "../../components/common/LoadingSpinner";
import { usePriceHistory } from "./hooks";

const PricingHistory = ({
  selectedCustomerId,
}: {
  selectedCustomerId: string;
}) => {
  const { data: priceHistory, isLoading } = usePriceHistory(selectedCustomerId);
  const items = Array.isArray(priceHistory) ? priceHistory.slice(0, 20) : [];

  return (
    <div className="card mt-4">
      <div className="p-4 border-b border-surface-200">
        <h3 className="font-display text-lg text-primary">Pricing History</h3>
      </div>
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Product</th>
                <th>Overridden By</th>
                <th>Old Price</th>
                <th>New Price</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-ink-faint py-6">
                    No pricing history
                  </td>
                </tr>
              )}
              {items.map((h: any) => (
                <tr key={h.overrideId}>
                  <td className="font-medium">
                    {h.product?.name || "—"}
                    {h.product?.sku && (
                      <span className="text-ink-faint text-xs ml-1">
                        ({h.product.sku})
                      </span>
                    )}
                  </td>
                  <td className="text-ink-muted">
                    {h.overriddenBy?.firstName} {h.overriddenBy?.lastName}
                    <span className="text-ink-faint text-xs ml-1">
                      @{h.overriddenBy?.username}
                    </span>
                  </td>
                  <td className="font-mono text-ink-muted">
                    NPR {h.oldPrice?.toLocaleString()}
                  </td>
                  <td className="font-mono text-green-600">
                    NPR {h.newPrice?.toLocaleString()}
                  </td>
                  <td className="text-ink-muted text-sm">{h.reason || "—"}</td>
                  <td className="text-ink-faint text-xs">
                    {new Date(h.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PricingHistory;