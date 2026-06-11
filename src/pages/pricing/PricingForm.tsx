import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCustomers } from "../customers/hooks";
import { useProducts } from "../products/hooks"; 
import { useSavePricingOverride } from "./hooks";

interface PricingFormValues {
  productId: string | null;
  customerId: string | null;
  basePrice: number | string;
  costPrice: number | string;
  reason: string;
}

const PricingForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { mutateAsync: saveOverride } = useSavePricingOverride();

  const { data: customerList, isLoading: customerLoading } = useCustomers();
  const { data: productList, isLoading: productsLoading } = useProducts();

  const {
    control,
    register,
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
      basePrice: "",
      costPrice: "",
      reason: "",
    },
  });

  const selectedProductId = watch("productId");

  // Automatically pre-populate default prices when a product is chosen
  useEffect(() => {
    if (selectedProductId && productList?.data) {
      const selectedProduct = productList.data.find(
        (product: any) => product.id === selectedProductId
      );

      if (selectedProduct) {
        setValue("basePrice", selectedProduct.basePrice ?? 0);
        setValue("costPrice", selectedProduct.costPrice ?? 0);
      }
    } else {
      setValue("basePrice", "");
      setValue("costPrice", "");
    }
  }, [selectedProductId, productList, setValue]);

  const onSubmit = async (values: PricingFormValues) => {
    // Standardize variables into strict numbers or undefined flags
    const cleanBasePrice = values.basePrice !== "" && !isNaN(Number(values.basePrice)) 
      ? Number(values.basePrice) 
      : undefined;

    const cleanCostPrice = values.costPrice !== "" && !isNaN(Number(values.costPrice)) 
      ? Number(values.costPrice) 
      : undefined;

    // Fail-safe check matching backend requirements
    if (cleanBasePrice === undefined && cleanCostPrice === undefined) {
      setError("root", {
        message: "Must provide at least one valid price rule to override.",
      });
      return;
    }

    try {
      await saveOverride({
        customerId: values.customerId!,
        productId: values.productId!,
        basePrice: cleanBasePrice,
        costPrice: cleanCostPrice,
        reason: values.reason || undefined,
      });

      reset();
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to save customer override pricing.",
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
        {/* Product Dropdown */}
        <div>
          <label className="form-label">Product *</label>
          <Controller
            name="productId"
            control={control}
            rules={{ required: "Product selection is required" }}
            render={({ field }) => (
              <select
                {...field}
                value={field.value || ""}
                className="form-field"
                disabled={productsLoading}
              >
                <option value="">
                  {productsLoading ? "Loading products..." : "Select Product"}
                </option>
                {productList?.data?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.sku ? `(${t.sku})` : ""}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.productId && (
            <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>
          )}
        </div>

        {/* Customer Dropdown */}
        <div>
          <label className="form-label">Customer Target *</label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: "Customer selection is required" }}
            render={({ field }) => (
              <select
                {...field}
                value={field.value || ""}
                className="form-field"
                disabled={customerLoading}
              >
                <option value="">
                  {customerLoading ? "Loading customers..." : "Select Customer to receive this price"}
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
            <p className="text-red-500 text-xs mt-1">{errors.customerId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Base Price Numeric Input Field */}
          <div>
            <label className="form-label">Base Price (NPR) *</label>
            <input
              type="number"
              step="any"
              className="form-field"
              placeholder="0.00"
              min={0}
              {...register("basePrice", {
                required: "Base Price is required",
                min: { value: 0, message: "Price must be 0 or more" },
                valueAsNumber: true, // Forces data to register straight as number type
              })}
            />
            {errors.basePrice && (
              <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>
            )}
          </div>

          {/* Cost Price Numeric Input Field */}
          <div>
            <label className="form-label">Cost Price (NPR) *</label>
            <input
              type="number"
              step="any"
              className="form-field"
              placeholder="0.00"
              min={0}
              {...register("costPrice", {
                required: "Cost Price is required",
                min: { value: 0, message: "Cost must be 0 or more" },
                valueAsNumber: true, // Forces data to register straight as number type
              })}
            />
            {errors.costPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.costPrice.message}</p>
            )}
          </div>
        </div>

        {/* Reason Field */}
        <div>
          <label className="form-label">Reason for Override Change</label>
          <input
            type="text"
            className="form-field"
            placeholder="e.g., Seasonal partner custom pricing agreement"
            {...register("reason")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center mt-4"
        >
          {isSubmitting ? "Saving Overrides…" : "Assign Custom Price to Customer"}
        </button>
      </form>
    </div>
  );
};

export default PricingForm;