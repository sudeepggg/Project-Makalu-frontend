import { ArrowLeft } from "lucide-react";
import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useDetailProducts } from "./hooks";

const ProductDetail: React.FC<{ id: string; onBack?: () => void }> = ({
  id,
  onBack,
}) => {
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
