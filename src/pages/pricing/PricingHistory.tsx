import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useCustomers } from "../customers/hooks";
import { useProducts } from "../products/hooks";
import { usePriceHistory } from "./hooks";

const PricingHistory = () => {
  const { data: priceHistory, isLoading } = usePriceHistory();
  const items = Array.isArray(priceHistory) ? priceHistory.slice(0, 20) : [];

  const { data: customerList } = useCustomers();
  const { data: productList } = useProducts();

  return (
    <div className="card">
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
                <th>Customer</th>
                <th>Override Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-ink-faint py-6">
                    No pricing history
                  </td>
                </tr>
              )}
              {items.map((h: any) => {
                const product = productList?.data?.find((p: any) => p.id === h.productId);
                const customer = customerList?.data?.find((c: any) => c.id === h.customerId);
                return (
                  <tr key={h.id}>
                    <td className="font-medium">{product?.name || "—"}</td>
                    <td className="text-ink-muted">
                      {customer?.name || "—"}
                    </td>
                    <td className="font-mono">
                      NPR {h.price?.toLocaleString()}
                    </td>
                    <td className="text-ink-faint text-xs">
                      {new Date(h.appliedDate).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default PricingHistory;
