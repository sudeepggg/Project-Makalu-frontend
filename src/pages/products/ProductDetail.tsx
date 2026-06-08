import { ArrowLeft, Sliders } from "lucide-react";
import React, { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useDetailProducts } from "./hooks";
import StockAdjustmentModal from "./StockAdjustmentModal";

const ProductDetail: React.FC<{ id: string; onBack?: () => void }> = ({
  id,
  onBack,
}) => {
    const [showAdjustStock, setShowAdjustStock] = useState(false);

  const { data: productDetail, isLoading } = useDetailProducts({ id: id });

  if (isLoading) return <LoadingSpinner />;
  if (!productDetail) return null;

  return (
    <div className="card">
      <div className="p-4 border-b border-surface-200 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-secondary py-1.5 px-2">
            <ArrowLeft size={16} />
          </button>
        )}
        <h3 className="font-display text-xl text-primary">
          {productDetail.name}
        </h3>
        <span className="font-mono text-xs text-ink-faint border border-surface-300 rounded px-2 py-0.5">
          {productDetail.sku}
        </span>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <p className="form-label">Category</p>
            <p className="text-sm">{productDetail.category?.name || "—"}</p>
          </div>
          <div>
            <p className="form-label">Unit of Measure</p>
            <p className="text-sm">
              {productDetail.unitOfMeasure?.name || "—"}
            </p>
          </div>
          <div>
            <p className="form-label">Base Price</p>
            <p className="text-sm font-mono">
              NPR {productDetail.basePrice?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="form-label">Cost Price</p>
            <p className="text-sm font-mono">
              NPR {productDetail.costPrice?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="form-label">Reorder Level</p>
            <p className="text-sm">{productDetail.reorderLevel}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="form-label">Supplier</p>
            <p className="text-sm">{productDetail.supplier?.name || "—"}</p>
          </div>
          <div>
            <p className="form-label">Description</p>
            <p className="text-sm text-ink-muted">{productDetail.description || "—"}</p>
          </div>
        </div>
      </div>
        {/* Adjust Stock — edit mode only */}
        <div className="border border-border rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Current Stock</p>
              <p className="text-xs text-secondary mt-0.5">
                {productDetail?.inventories?.[0]?.quantityOnHand ?? 0} units on hand
                {" · "}
                {productDetail?.inventories?.[0]?.quantityAvailable ?? 0} available
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdjustStock(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-gray-50 text-secondary transition-colors"
            >
              <Sliders size={14} />
              Adjust Stock
            </button>
          </div>

          {/* Inline modal */}
          {showAdjustStock && (
            <div className="border-t border-border pt-3">
              <StockAdjustmentModal
                product={productDetail}
                onClose={() => setShowAdjustStock(false)}
              />
            </div>
          )}
        </div>
    
      {productDetail.inventories?.length > 0 && (
        <div className="border-t border-surface-200 p-5">
          <p className="form-label mb-3">Inventory</p>
          <table className="table-base">
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>On Hand</th>
                <th>Reserved</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {productDetail.inventories.map((i: any) => (
                <tr key={i.id}>
                  <td>{i.warehouse?.name}</td>
                  <td className="font-mono">{i.quantityOnHand}</td>
                  <td className="font-mono">{i.quantityReserved}</td>
                  <td className="font-mono">{i.quantityAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ProductDetail;
