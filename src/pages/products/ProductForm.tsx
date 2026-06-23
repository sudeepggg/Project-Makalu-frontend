import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../../components/ContolledFields/InputField";
import { useCategories, useUnitOfMeasure } from "../../hooks";
import { useSuppliers } from "../suppliers/hooks";
import { useAddProducts, useUpdateProducts } from "./hooks";
import SelectField from "../../components/ContolledFields/SelectField";

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

const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProductForm: React.FC<{
  onSaved?: () => void;
  product?: any;
}> = ({ onSaved, product }) => {
  const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
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
  // const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const methods = useForm<ProductFormValues>({
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

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

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

      if (product.imageUrl) {
        const fullUrl = `${BASE_URL}${product.imageUrl}`;
        // setExistingImageUrl(fullUrl);
        setImagePreview(fullUrl);
      }
    }
  }, [product, reset, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImageError("");
    setImagePreview("");
    // setExistingImageUrl("");
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setImageError("");
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
        formData.append("imageUrl", imageFile);
      }

      if (removeExistingImage && !imageFile) {
        formData.append("imageUrl", "true");
      }

      if (isEditMode && product?.id) {
        await updateProduct({ id: product.id, data: formData });
      } else {
        await addProduct(formData);
      }

      reset();
      setImageFile(null);
      setImagePreview("");
      // setExistingImageUrl("");
      setRemoveExistingImage(false);
      qc.invalidateQueries({ queryKey: ["products"] });
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to save product.",
      });
    }
  };

  const categoryOptions =
    categories?.map((c: { id: string; name: string }) => ({
      label: c.name,
      value: c.id,
    })) ?? [];

  const unitOptions =
    unitOfMeasures?.map(
      (u: { id: string; name: string; abbreviation?: string }) => ({
        label: `${u.name}${u.abbreviation ? ` (${u.abbreviation})` : ""}`,
        value: u.id,
      }),
    ) ?? [];

  const supplierOptions = suppliers.map((s: { id: string; name: string }) => ({
    label: s.name,
    value: s.id,
  }));

  return (
    <div className="h-full">
      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <FormProvider {...methods}>
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
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-secondary
                  ${
                    imageError
                      ? "border-red-400 bg-red-50 hover:border-red-500"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
              >
                <ImagePlus
                  size={24}
                  className={`mb-2 opacity-50 ${imageError ? "text-red-400" : ""}`}
                />
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
            {imageError && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {imageError}
              </p>
            )}
          </div>

          {/* SKU & Name */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              name="sku"
              label="SKU *"
              placeholder="PRD-001"
              rules={{ required: "SKU is required" }}
            />
            <InputField
              name="name"
              label="Name *"
              placeholder="Product name"
              rules={{ required: "Product name is required" }}
            />
          </div>

          {/* Description */}
          <InputField
            name="description"
            label="Description"
            placeholder="Product description..."
            multiline
            rows={3}
          />

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              name="basePrice"
              label="Base Price (NPR) *"
              type="number"
              rules={{
                required: "Base price is required",
                min: { value: 0, message: "Must be 0 or more" },
              }}
            />
            <InputField
              name="costPrice"
              label="Cost Price (NPR)"
              type="number"
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
            />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              name="categoryId"
              label="Category *"
              placeholder="Select category"
              options={categoryOptions}
              rules={{ required: "Category is required" }}
            />
            <SelectField
              name="unitOfMeasureId"
              label="Unit of Measure *"
              placeholder="Select unit"
              options={unitOptions}
              rules={{ required: "Unit of measure is required" }}
            />
          </div>

          {/* Supplier */}
          <SelectField
            name="supplierId"
            label="Supplier"
            placeholder="Select supplier"
            options={supplierOptions}
          />

          {/* Stock Info */}
          <div
            className={`grid ${isEditMode ? "grid-cols-2" : "grid-cols-3"} gap-3`}
          >
            {!isEditMode && (
              <InputField
                name="openingStock"
                label="Opening Stock"
                type="number"
                rules={{ min: { value: 0, message: "Must be 0 or more" } }}
              />
            )}

            <InputField
              name="reorderLevel"
              label="Reorder Level"
              type="number"
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
            />

            <InputField
              name="reorderQuantity"
              label="Reorder Qty"
              type="number"
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
            />
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
      </FormProvider>
    </div>
  );
};

export default ProductForm;
