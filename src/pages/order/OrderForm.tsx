import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useCustomers } from "../customers/hooks";
import { useProducts } from "../products/hooks";
import { useSaveOrder } from "./hooks";
import SelectField from "../../components/ContolledFields/SelectField";
import InputField from "../../components/ContolledFields/InputField";

const OrderForm: React.FC<{ onSaved?: () => void; order?: any }> = ({
  onSaved,
  order,
}) => {
  const { mutateAsync } = useSaveOrder();
  const isEditing = Boolean(order);

  const { data: customerList, isLoading: customerLoading } = useCustomers();
  const { data: productList, isLoading: productsLoading } = useProducts();

  const methods = useForm<any>({
    defaultValues: {
      customerId: order?.customerId ?? "",
      notes: order?.notes ?? "",
      items: order?.items?.map((it: any) => ({
        productId: it.productId,
        quantity: it.quantity,
      })) ?? [{ productId: "", quantity: 1 }],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

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

  const customerOptions =
    customerList?.data?.map((t: any) => ({
      label: t.name,
      value: t.id,
    })) ?? [];

  const productOptions =
    productList?.data?.map((t: any) => ({
      label: t.name,
      value: t.id,
    })) ?? [];

  return (
    <div className="fade-in">
      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer */}
          <SelectField
            name="customerId"
            label="Customer *"
            placeholder={customerLoading ? "Loading..." : "Select customer"}
            options={customerOptions}
            isLoading={customerLoading}
            rules={{ required: "Customer is required" }}
          />

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
                  {/* Product */}
                  <div className="flex-1">
                    <SelectField
                      name={`items.${idx}.productId`}
                      placeholder={
                        productsLoading ? "Loading..." : "Select product"
                      }
                      options={productOptions}
                      isLoading={productsLoading}
                      rules={{ required: "Product is required" }}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-20">
                    <InputField
                      name={`items.${idx}.quantity`}
                      type="number"
                      placeholder="Qty"
                      rules={{
                        required: "Quantity is required",
                        min: { value: 1, message: "Min 1" },
                      }}
                    />
                  </div>

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
          <InputField name="notes" label="Notes" placeholder="Optional notes…" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center"
          >
            {isEditing ? "Update Order" : "Create Order"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default OrderForm;