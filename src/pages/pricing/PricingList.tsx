import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { usePriceLists } from "./hooks";

interface PricingListProps {
  customerId: string;
  showAllProducts: boolean;
}

const PricingList: React.FC<PricingListProps> = ({ customerId, showAllProducts }) => {
  // Fetch our targeted custom price matrix list for this specific customer
  const { data: comparisonData, isLoading } = usePriceLists(customerId);
  

  // Extract rows cleanly from our envelope structure safely
  const records = Array.isArray(comparisonData?.data)
    ? comparisonData.data
    : [];

  // Filter the rows on the fly depending on what the user picked in the dropdown
  const filteredRecords = records.filter((item: any) => {
    if (showAllProducts) return true; // Show all products in the database

    // Otherwise, show only items that actually have custom data saved to them
    return item.overrideBasePrice !== null || item.overrideCostPrice !== null;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
        <div>
          <h3 className="font-display text-lg text-primary">
            Customer Product Price Matrix
          </h3>
          <p className="text-xs text-ink-faint mt-0.5">
            Active custom base prices and cost overrides assigned to this
            customer account.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-100 text-xs font-semibold text-ink-muted uppercase border-b border-surface-200">
              <th className="p-3">Product Details</th>
              <th className="p-3">Base Price (Orig)</th>
              <th className="p-3">Custom Override</th>
              <th className="p-3">Cost Price (Orig)</th>
              <th className="p-3">Custom Cost</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 text-sm">
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-faint">
                  No active customer overrides set up for this entity. Default
                  global pricing will apply.
                </td>
              </tr>
            )}

            {filteredRecords.map((item: any) => {
              const hasBaseOverride = item.overrideBasePrice !== null;
              const hasCostOverride = item.overrideCostPrice !== null;

              return (
                <tr
                  key={item.productId}
                  className="hover:bg-surface-50 transition-colors"
                >
                  {/* Product Details */}
                  <td className="p-3">
                    <p className="font-medium text-ink">{item.productName}</p>
                    <p className="text-xs font-mono text-ink-faint">
                      SKU: {item.sku || "N/A"}
                    </p>
                  </td>

                  {/* Base Price Original */}
                  <td className="p-3 font-mono text-ink-muted">
                    NPR {item.originalBasePrice.toFixed(2)}
                  </td>

                  {/* Base Override Status / Diff */}
                  <td className="p-3 font-mono">
                    {hasBaseOverride ? (
                      <div>
                        <span className="font-semibold text-primary">
                          NPR {item.overrideBasePrice.toFixed(2)}
                        </span>
                        <span
                          className={`block text-xs font-sans mt-0.5 ${item.basePriceDiff < 0 ? "text-emerald-600" : "text-amber-600"}`}
                        >
                          ({item.basePriceDiff >= 0 ? "+" : ""}
                          {item.basePriceDiff.toFixed(2)})
                        </span>
                      </div>
                    ) : (
                      <span className="text-ink-faint italic text-xs">
                        Standard
                      </span>
                    )}
                  </td>

                  {/* Cost Price Original */}
                  <td className="p-3 font-mono text-ink-muted">
                    NPR {item.originalCostPrice.toFixed(2)}
                  </td>

                  {/* Cost Override Status / Diff */}
                  <td className="p-3 font-mono">
                    {hasCostOverride ? (
                      <div>
                        <span className="font-semibold text-ink">
                          NPR {item.overrideCostPrice.toFixed(2)}
                        </span>
                        <span
                          className={`block text-xs font-sans mt-0.5 ${item.costPriceDiff < 0 ? "text-emerald-600" : "text-amber-600"}`}
                        >
                          ({item.costPriceDiff >= 0 ? "+" : ""}
                          {item.costPriceDiff.toFixed(2)})
                        </span>
                      </div>
                    ) : (
                      <span className="text-ink-faint italic text-xs">
                        Standard
                      </span>
                    )}
                  </td>

                  {/* Status Badges */}
                  <td className="p-3 text-right">
                    {hasBaseOverride || hasCostOverride ? (
                      <span className="bg-primary-50 text-primary border border-primary-100 rounded-full text-xs px-2.5 py-0.5 font-medium">
                        Custom Rule
                      </span>
                    ) : (
                      <span className="bg-surface-100 text-ink-muted rounded-full text-xs px-2.5 py-0.5 font-medium">
                        Global Standard
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingList;
