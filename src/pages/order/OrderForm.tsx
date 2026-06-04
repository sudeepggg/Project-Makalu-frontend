import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useCustomers } from "../customers/hooks";
import { useSaveOrder } from "./hooks";
import { useProducts } from "../products/hooks";

const OrderForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { mutateAsync } = useSaveOrder();

  const { data: customerList, isLoading: customerLoading } = useCustomers();
  const { data: productList, isLoading: productsLoading } = useProducts();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: {
      customerId: "",
      notes: "",
      items: [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = async (data: any) => {
    try {
      await mutateAsync({
        customerId: data.customerId,
        items: data.items.map((it: any) => ({
          ...it,
          quantity: Number(it.quantity),
        })),
        notes: data.notes,
      });
      reset();
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to create order.",
      });
    }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Order</h3>

      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer ID */}
        <div>
          <label className="form-label">Customer ID *</label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: "Customer type is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="form-field"
                disabled={customerLoading}
              >
                <option value="">
                  {customerLoading ? "Loading..." : "Select type"}
                </option>
                {customerList?.data?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.customerId && (
            <p className="text-red-500 text-xs mt-1">
              {typeof errors.customerId.message === "string"
                ? errors.customerId.message
                : "Invalid customer"}
            </p>
          )}
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="form-label mb-0">Order Items *</label>
            <button
              type="button"
              onClick={() => append({ productId: "", quantity: 1 })}
              className="btn-secondary py-1 px-2 text-xs"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-start">
                {/* Product ID */}
                <div className="flex-1">
                  <Controller
                    name={`items.${idx}.productId`}
                    control={control}
                    rules={{ required: "Product is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="form-field"
                        disabled={productsLoading}
                      >
                        <option value="">
                          {productsLoading ? "Loading..." : "Select product"}
                        </option>
                        {productList?.data?.map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.items?.[idx]?.productId && (
                    <p className="text-red-500 text-xs mt-1">
                      {typeof errors.items?.[idx]?.productId.message ===
                      "string"
                        ? errors.items?.[idx]?.productId?.message
                        : "Invalid product"}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <Controller
                  control={control}
                  name={`items.${idx}.quantity`}
                  rules={{
                    required: "Quantity is required",
                    min: { value: 1, message: "Min 1" },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="form-field w-20 text-sm"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                {errors.items?.[idx]?.quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.items?.[idx]?.quantity?.message}
                  </p>
                )}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-2 text-red-400 hover:text-red-600 mt-0.5"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Notes</label>
          <Controller
            control={control}
            name="notes"
            render={({ field }) => (
              <textarea
                {...field}
                rows={2}
                className="form-field resize-none"
                placeholder="Optional notes…"
              />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? "Creating…" : "Create Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
