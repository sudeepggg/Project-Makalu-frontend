import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCategories, useUnitOfMeasure } from "../../hooks";
import { useSuppliers } from "../suppliers/hooks";
import { useAddProducts, useUpdateProducts } from "./hooks";

type ProductFormValues = {
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  unitOfMeasureId: string;
  basePrice: number;
  costPrice: number;
  reorderLevel: number;
  reorderQuantity: number;
  openingStock: number;
  supplierId: string;
};

const ProductForm: React.FC<{
  onSaved?: () => void;
  product?: any; // Single product for edit mode
}> = ({ onSaved, product }) => {
  const qc = useQueryClient();
  const { data: unitOfMeasures } = useUnitOfMeasure();
  const { data: categories } = useCategories();
  const { data: suppliersResult } = useSuppliers();

  const isEditMode = Boolean(product);
  const { mutateAsync: addProduct } = useAddProducts();
  const { mutateAsync: updateProduct } = useUpdateProducts();

  const suppliers = suppliersResult?.data || [];

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

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
      reorderLevel: 10,
      reorderQuantity: 50,
      openingStock: 0,
      supplierId: "",
    },
  });

  // Populate form in edit mode
  useEffect(() => {
    if (product && isEditMode) {
      reset({
        sku: product.sku || "",
        name: product.name || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        unitOfMeasureId: product.unitOfMeasureId || "",
        basePrice: Number(product.basePrice) || 0,
        costPrice: Number(product.costPrice) || 0,
        reorderLevel: Number(product.reorderLevel) || 10,
        reorderQuantity: Number(product.reorderQuantity) || 50,
        openingStock: Number(product.openingStock) || 0,
        supplierId: product.supplierId || "",
      });

      if (product.image) {
        setExistingImageUrl(product.image);
        setImagePreview(product.image);
      }
    }
  }, [product, reset, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (isEditMode && existingImageUrl) {
      setImagePreview(existingImageUrl);
    } else {
      setImagePreview("");
      setExistingImageUrl("");
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      formData.append("sku", data.sku);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("categoryId", data.categoryId);
      formData.append("unitOfMeasureId", data.unitOfMeasureId);
      formData.append("basePrice", String(data.basePrice));
      formData.append("costPrice", String(data.costPrice));
      formData.append("reorderLevel", String(data.reorderLevel));
      formData.append("reorderQuantity", String(data.reorderQuantity));
      formData.append("openingStock", String(data.openingStock));

      if (data.supplierId) {
        formData.append("supplierId", data.supplierId);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditMode && product?.id) {
        const result = await updateProduct({ id: product.id, data: formData });
        console.log("===>", result);
      } else {
        await addProduct(formData);
      }

      // Reset form
      reset();
      setImageFile(null);
      setImagePreview("");
      setExistingImageUrl("");
      qc.invalidateQueries({ queryKey: ["products"] });
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to save product.",
      });
    }
  };

  return (
    <div className="h-full">
      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Image */}
        <div>
          <label className="form-label">Product Image</label>
          {imagePreview ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="productImage"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-secondary"
            >
              <ImagePlus size={24} className="mb-2 opacity-50" />
              <span className="text-sm">Click to upload image</span>
              <span className="text-xs opacity-60 mt-1">
                JPG, PNG, WebP — max 5MB
              </span>
              <input
                id="productImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* SKU & Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">SKU *</label>
            <Controller
              name="sku"
              control={control}
              rules={{ required: "SKU is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`form-field ${errors.sku ? "border-red-400" : ""}`}
                  placeholder="PRD-001"
                />
              )}
            />
            {errors.sku && (
              <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Name *</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Product name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`form-field ${errors.name ? "border-red-400" : ""}`}
                  placeholder="Product name"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
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

        {/* Prices */}
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
                  min={0}
                  className={`form-field ${errors.basePrice ? "border-red-400" : ""}`}
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
            <label className="form-label">Cost Price (NPR)</label>
            <Controller
              name="costPrice"
              control={control}
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min={0}
                  className={`form-field ${errors.costPrice ? "border-red-400" : ""}`}
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

        {/* Category & Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Category *</label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className={`form-field ${errors.categoryId ? "border-red-400" : ""}`}
                >
                  <option value="">Select category</option>
                  {categories?.map((c: { id: string; name: string }) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                <select
                  {...field}
                  className={`form-field ${errors.unitOfMeasureId ? "border-red-400" : ""}`}
                >
                  <option value="">Select unit</option>
                  {unitOfMeasures?.map(
                    (u: {
                      id: string;
                      name: string;
                      abbreviation?: string;
                    }) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.abbreviation && `(${u.abbreviation})`}
                      </option>
                    ),
                  )}
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

        {/* Supplier */}
        <div>
          <label className="form-label">Supplier</label>
          <Controller
            name="supplierId"
            control={control}
            render={({ field }) => (
              <select {...field} className="form-field">
                <option value="">Select supplier</option>
                {suppliers.map((s: { id: string; name: string }) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Stock Info */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="form-label">Opening Stock</label>
            <Controller
              name="openingStock"
              control={control}
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min={0}
                  className={`form-field ${errors.openingStock ? "border-red-400" : ""}`}
                />
              )}
            />
            {errors.openingStock && (
              <p className="text-red-500 text-xs mt-1">
                {errors.openingStock.message}
              </p>
            )}
          </div>

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
                  min={0}
                  className={`form-field ${errors.reorderLevel ? "border-red-400" : ""}`}
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
            <label className="form-label">Reorder Qty</label>
            <Controller
              name="reorderQuantity"
              control={control}
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min={0}
                  className={`form-field ${errors.reorderQuantity ? "border-red-400" : ""}`}
                />
              )}
            />
            {errors.reorderQuantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reorderQuantity.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-6"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Saving…
            </>
          ) : isEditMode ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
