import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useKpis } from "./hooks";

const TopProductsTable: React.FC = () => {
  const { data, isLoading } = useKpis({ types: "sales" });

  const product = data?.byProduct || [];

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg text-primary mb-4">Top Products</h3>
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <div className="space-y-2">
          {(product || []).length === 0 && (
            <p className="text-sm text-ink-faint text-center py-4">
              No sales data yet
            </p>
          )}
          {(product || []).map((item: any, i: number) => (
            <div key={item.productId} className="flex items-center gap-3">
              <span className="text-xs font-mono text-ink-faint w-4">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {item.name}
                </p>
                <p className="text-xs text-ink-faint font-mono">{item.sku}</p>
              </div>
              <span className="text-sm font-semibold text-primary shrink-0">
                NPR {item.sales?.toLocaleString() ?? 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default TopProductsTable;
