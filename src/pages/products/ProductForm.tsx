import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import { endpoints } from "../../api/endpoints";
import { useCategories, useUnitOfMeasure } from "../../hooks";
import { useSuppliers } from "../suppliers/hooks";

const ProductForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const qc = useQueryClient();
  const { data: unitOfMeasures } = useUnitOfMeasure();
  const { data: categories } = useCategories();
  const { data: suppliersResult } = useSuppliers();
  const suppliers = suppliersResult?.data || [];

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    categoryId: "",
    unitOfMeasureId: "",
    basePrice: 0,
    reorderLevel: 0,
    supplierId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post(endpoints.products, {
        ...form,
        basePrice: Number(form.basePrice),
        reorderLevel: Number(form.reorderLevel),
      });
      setForm({
        sku: "",
        name: "",
        description: "",
        categoryId: "",
        unitOfMeasureId: "",
        basePrice: 0,
        reorderLevel: 0,
        supplierId: "",
      });
      qc.invalidateQueries({ queryKey: ["products"] });
      onSaved?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Product</h3>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={submit} className="space-y-3">
        {/* SKU and Base Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">SKU *</label>
            <input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              className="form-field"
              placeholder="PRD-001"
              required
            />
          </div>
          <div>
            <label className="form-label">Base Price (NPR) *</label>
            <input
              type="number"
              value={form.basePrice}
              onChange={(e) => set("basePrice", e.target.value)}
              className="form-field"
              min={0}
              required
            />
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="form-label">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="form-field"
            placeholder="Product name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="form-field resize-none"
            placeholder="Product description..."
            rows={3}
          />
        </div>

        {/* Category and Unit of Measure */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="form-field"
              required
            >
              <option value="">Select category</option>
              {categories?.map((category: { id: string; name: string }) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Unit of Measure *</label>
            <select
              value={form.unitOfMeasureId}
              onChange={(e) => set("unitOfMeasureId", e.target.value)}
              className="form-field"
              required
            >
              <option value="">Select unit</option>
              {unitOfMeasures?.map((uom: { id: string; name: string }) => (
                <option key={uom.id} value={uom.id}>
                  {uom.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reorder Level and Supplier */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Reorder Level</label>
            <input
              type="number"
              value={form.reorderLevel}
              onChange={(e) => set("reorderLevel", e.target.value)}
              className="form-field"
              min={0}
            />
          </div>
          <div>
            <label className="form-label">Supplier</label>
            <select
              value={form.supplierId}
              onChange={(e) => set("supplierId", e.target.value)}
              className="form-field"
            >
              <option value="">Select supplier</option>
              {suppliers?.map((supplier: { id: string; name: string }) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? (
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
