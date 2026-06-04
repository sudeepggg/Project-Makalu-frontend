import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { endpoints } from "../../api/endpoints";
import { useCategories, useUnitOfMeasure } from "../../hooks";
import { useSuppliers } from "../suppliers/hooks";

type ProductFormValues = {
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  unitOfMeasureId: string;
  basePrice: number;
  costPrice: number;
  reorderLevel: number;
  supplierId: string;
};

const ProductForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const qc = useQueryClient();
  const { data: unitOfMeasures } = useUnitOfMeasure();
  const { data: categories } = useCategories();
  const { data: suppliersResult } = useSuppliers();
  const suppliers = suppliersResult?.data || [];

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      categoryId: "",
      unitOfMeasureId: "",
      basePrice: 0,
      costPrice: 0,
      reorderLevel: 0,
      supplierId: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await api.post(endpoints.products, {
        ...data,
        basePrice: Number(data.basePrice),
        costPrice: Number(data.costPrice),
        reorderLevel: Number(data.reorderLevel),
      });
      reset();
      qc.invalidateQueries({ queryKey: ["products"] });
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to create product.",
      });
    }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Product</h3>

      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* SKU */}
        <div>
          <label className="form-label">SKU *</label>
          <Controller
            name="sku"
            control={control}
            rules={{ required: "SKU is required" }}
            render={({ field }) => (
              <input {...field} className="form-field" placeholder="PRD-001" />
            )}
          />
          {errors.sku && (
            <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
          )}
        </div>

        {/* Base Price and Cost Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Base Price (NPR) *</label>
            <Controller
              name="basePrice"
              control={control}
              rules={{
                required: "Base price is required",
                min: { value: 0, message: "Must be 0 or more" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="form-field"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.basePrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.basePrice.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Cost Price (NPR) *</label>
            <Controller
              name="costPrice"
              control={control}
              rules={{
                required: "Cost price is required",
                min: { value: 0, message: "Must be 0 or more" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="form-field"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.costPrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.costPrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="form-label">Name *</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Product name is required" }}
            render={({ field }) => (
              <input
                {...field}
                className="form-field"
                placeholder="Product name"
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="form-field resize-none"
                placeholder="Product description..."
                rows={3}
              />
            )}
          />
        </div>

        {/* Category and Unit of Measure */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Category *</label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <select {...field} className="form-field">
                  <option value="">Select category</option>
                  {categories?.map((category: { id: string; name: string }) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Unit of Measure *</label>
            <Controller
              name="unitOfMeasureId"
              control={control}
              rules={{ required: "Unit of measure is required" }}
              render={({ field }) => (
                <select {...field} className="form-field">
                  <option value="">Select unit</option>
                  {unitOfMeasures?.map((uom: { id: string; name: string }) => (
                    <option key={uom.id} value={uom.id}>
                      {uom.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.unitOfMeasureId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.unitOfMeasureId.message}
              </p>
            )}
          </div>
        </div>

        {/* Reorder Level and Supplier */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Reorder Level</label>
            <Controller
              name="reorderLevel"
              control={control}
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="form-field"
                  onChange={(e) => field.onChange((e.target.value))}
                />
              )}
            />
            {errors.reorderLevel && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reorderLevel.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Supplier</label>
            <Controller
              name="supplierId"
              control={control}
              render={({ field }) => (
                <select {...field} className="form-field">
                  <option value="">Select supplier</option>
                  {suppliers?.map((supplier: { id: string; name: string }) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Saving…
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
