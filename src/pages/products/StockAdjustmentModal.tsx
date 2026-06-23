import { useEffect, useState } from "react";
import { useStockAdjustment } from "./hooks";

const StockAdjustmentModal: React.FC<{
  product: any;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const { mutateAsync, isPending } = useStockAdjustment();
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const inventory = product.inventories?.[0];
  const currentStock = inventory?.quantityOnHand ?? 0;
  const warehouseId = inventory?.warehouseId;

  // Set newQuantity to current stock on load
  useEffect(() => {
    setNewQuantity(currentStock);
  }, [currentStock]);

  const diff = newQuantity - currentStock;

  const handleSubmit = async () => {
    setError("");
    if (newQuantity < 0) return setError("Quantity cannot be negative");
    if (newQuantity === currentStock)
      return setError("New quantity is the same as current stock");
    if (!warehouseId) return setError("No warehouse found for this product");

    try {
      await mutateAsync({
        productId: product.id,
        warehouseId,
        currentQuantity: currentStock,
        newQuantity,
        reason,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to adjust stock");
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Stock */}
      <div className="flex justify-between text-sm bg-gray-50 rounded-lg p-3">
        <span className="text-secondary">Current Stock</span>
        <span className="font-semibold">{currentStock}</span>
      </div>

      {/* New Quantity Input */}
      <div>
        <label className="form-label">New Quantity</label>
        <input
          type="number"
          min={0}
          className="form-field"
          value={newQuantity}
          onChange={(e) => setNewQuantity(Number(e.target.value))}
        />
      </div>

      {/* Reason */}
      <div>
        <label className="form-label">Reason (optional)</label>
        <input
          type="text"
          className="form-field"
          placeholder="e.g. Stock count correction"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* Diff Preview */}
      {newQuantity !== currentStock && (
        <div className="flex justify-between text-sm bg-gray-50 rounded-lg p-3">
          <span className="text-secondary">Change</span>
          <span
            className={`font-semibold ${diff < 0 ? "text-red-500" : "text-green-600"}`}
          >
            {diff > 0 ? `+${diff}` : diff} units
          </span>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Confirm Adjustment"}
      </button>
    </div>
  );
};

export default StockAdjustmentModal;
