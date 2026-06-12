import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCustomers } from "../customers/hooks";
import { useProducts } from "../products/hooks";
import { useSavePricingOverride } from "./hooks";

interface PricingFormValues {
  productId: string;
  customerId: string;
  newBasePrice: number | "";
  newCostPrice: number | "";
  reason: string;
}

const PricingForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { mutateAsync: saveOverride } = useSavePricingOverride();
  const { data: customerList, isLoading: customerLoading } = useCustomers();
  const { data: productList, isLoading: productsLoading } = useProducts();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PricingFormValues>({
    defaultValues: {
      productId: "",
      customerId: "",
      newBasePrice: "",
      newCostPrice: "",
      reason: "",
    },
  });

  const selectedProductId = watch("productId");

  useEffect(() => {
    if (selectedProductId && productList?.data) {
      const selectedProduct = productList.data.find(
        (p: any) => p.id === selectedProductId
      );
      if (selectedProduct) {
        setValue("newBasePrice", selectedProduct.basePrice ?? "");
        setValue("newCostPrice", selectedProduct.costPrice ?? "");
      }
    } else {
      setValue("newBasePrice", "");
      setValue("newCostPrice", "");
    }
  }, [selectedProductId, productList, setValue]);

  const onSubmit = async (values: PricingFormValues) => {
    const cleanBasePrice =
      values.newBasePrice !== "" && !isNaN(Number(values.newBasePrice))
        ? Number(values.newBasePrice)
        : undefined;

    const cleanCostPrice =
      values.newCostPrice !== "" && !isNaN(Number(values.newCostPrice))
        ? Number(values.newCostPrice)
        : undefined;

    if (cleanBasePrice === undefined && cleanCostPrice === undefined) {
      setError("root", {
        message: "Must provide at least one valid price to override.",
      });
      return;
    }

    try {
      await saveOverride({
        customerId: values.customerId,
        productId: values.productId,
        newBasePrice: cleanBasePrice,
        newCostPrice: cleanCostPrice,
        reason: values.reason || undefined,
      });
      reset();
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message:
          err?.response?.data?.message ?? "Failed to save price override.",
      });
    }
  };

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg text-primary mb-4">Price Override</h3>

      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Product */}
        <div>
          <label className="form-label">Product *</label>
          <Controller
            name="productId"
            control={control}
            rules={{ required: "Product is required" }}
            render={({ field }) => (
              <select {...field} className="form-field" disabled={productsLoading}>
                <option value="">
                  {productsLoading ? "Loading products..." : "Select Product"}
                </option>
                {productList?.data?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.sku ? `(${p.sku})` : ""}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.productId && (
            <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>
          )}
        </div>

        {/* Customer */}
        <div>
          <label className="form-label">Customer *</label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: "Customer is required" }}
            render={({ field }) => (
              <select {...field} className="form-field" disabled={customerLoading}>
                <option value="">
                  {customerLoading ? "Loading customers..." : "Select Customer"}
                </option>
                {customerList?.data?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.customerId && (
            <p className="text-red-500 text-xs mt-1">{errors.customerId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Base Price */}
          <div>
            <label className="form-label">Base Price (NPR)</label>
            <Controller
              name="newBasePrice"
              control={control}
              rules={{ min: { value: 0, message: "Price must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="any"
                  min={0}
                  placeholder="0.00"
                  className="form-field"
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              )}
            />
            {errors.newBasePrice && (
              <p className="text-red-500 text-xs mt-1">{errors.newBasePrice.message}</p>
            )}
          </div>

          {/* Cost Price */}
          <div>
            <label className="form-label">Cost Price (NPR)</label>
            <Controller
              name="newCostPrice"
              control={control}
              rules={{ min: { value: 0, message: "Cost must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="any"
                  min={0}
                  placeholder="0.00"
                  className="form-field"
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              )}
            />
            {errors.newCostPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.newCostPrice.message}</p>
            )}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="form-label">Reason for Override</label>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="form-field"
                placeholder="e.g., Seasonal partner custom pricing agreement"
              />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center mt-4"
        >
          {isSubmitting ? "Saving…" : "Assign Custom Price to Customer"}
        </button>
      </form>
    </div>
  );
};

export default PricingForm;