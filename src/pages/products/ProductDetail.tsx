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

  const inventory = productDetail.inventories?.[0];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="btn-secondary py-1.5 px-2">
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h2 className="font-display text-2xl text-primary">
              {productDetail.name}
            </h2>
            <p className="text-sm text-ink-faint font-mono">
              {productDetail.sku}
            </p>
          </div>
          <span
            className={
              productDetail.isActive ? "badge-delivered" : "badge-draft"
            }
          >
            {productDetail.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div className="card">
        <div className="p-5 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-100 rounded-lg p-4">
              <p className="text-xs text-ink-faint mb-1">Base price</p>
              <p className="text-xl font-medium">
                NPR {productDetail.basePrice?.toLocaleString()}
              </p>
            </div>
            <div className="bg-surface-100 rounded-lg p-4">
              <p className="text-xs text-ink-faint mb-1">Cost price</p>
              <p className="text-xl font-medium">
                NPR {productDetail.costPrice?.toLocaleString()}
              </p>
            </div>
            <div className="bg-surface-100 rounded-lg p-4">
              <p className="text-xs text-ink-faint mb-1">On hand</p>
              <p className="text-xl font-medium">
                {inventory?.quantityOnHand ?? 0} units
              </p>
            </div>
            <div className="bg-surface-100 rounded-lg p-4">
              <p className="text-xs text-ink-faint mb-1">Available</p>
              <p className="text-xl font-medium">
                {inventory?.quantityAvailable ?? 0} units
              </p>
            </div>
          </div>

          {/* Details card */}
          <div className="border border-surface-200 rounded-lg p-4">
            <p className="font-medium text-sm mb-3">Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-ink-faint mb-1">Category</p>
                <p>{productDetail.category?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1">Unit of measure</p>
                <p>{productDetail.unitOfMeasure?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1">Reorder level</p>
                <p>{productDetail.reorderLevel}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint mb-1">Supplier</p>
                <p>{productDetail.supplier?.name || "—"}</p>
              </div>
            </div>
            <div className="border-t border-surface-200 mt-4 pt-3">
              <p className="text-xs text-ink-faint mb-1">Description</p>
              <p className="text-sm text-ink-muted">
                {productDetail.description || "—"}
              </p>
            </div>
          </div>

          {/* Stock adjustment */}
          <div className="border border-surface-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Stock</p>
              <button
                type="button"
                onClick={() => setShowAdjustStock(true)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-100 text-ink-muted transition-colors"
              >
                <Sliders size={14} />
                Adjust Stock
              </button>
            </div>

            {showAdjustStock && (
              <div className="border-t border-surface-200 mt-3 pt-3">
                <StockAdjustmentModal
                  product={productDetail}
                  onClose={() => setShowAdjustStock(false)}
                />
              </div>
            )}
          </div>

          {/* Inventory by warehouse */}
          {productDetail.inventories?.length > 0 && (
            <div className="border border-surface-200 rounded-lg p-4">
              <p className="font-medium text-sm mb-3">Inventory by warehouse</p>
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
      </div>
    </>
  );
};

export default ProductDetail;
