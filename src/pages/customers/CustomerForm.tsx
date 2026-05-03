import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import api from "../../api/client";
import { endpoints } from "../../api/endpoints";
import { useAddCustomers } from "./hooks";

type FormValues = {
  name: string;
  customerTypeId: string;
  email: string;
  phone: string;
  city: string;
  creditLimit: number;
};

const CustomerForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { mutateAsync: addCustomer } = useAddCustomers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      customerTypeId: "",
      email: "",
      phone: "",
      city: "",
      creditLimit: 0,
    },
  });

  const [error, setError] = React.useState("");

  const onSubmit = (values: FormValues) => {
    setError("");

    try {
      addCustomer(values, {
        onSuccess: () => {
          reset();
          onSaved?.();
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message || "Failed"),
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create customer.");
    }
  };

  return (
    <div className="card p-5 fade-in">
      <h3 className="font-display text-lg text-primary mb-4">New Customer</h3>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="form-label">Name *</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                {...field}
                className="form-field"
                placeholder="Customer name"
              />
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Customer Type ID *</label>
          <Controller
            name="customerTypeId"
            control={control}
            rules={{ required: "Customer type is required" }}
            render={({ field }) => (
              <input
                {...field}
                className="form-field"
                placeholder="UUID from DB"
              />
            )}
          />
          {errors.customerTypeId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.customerTypeId.message}
            </p>
          )}
          <p className="text-xs text-ink-faint mt-1">
            Use the customer type UUID from your database seed
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="form-field"
                  placeholder="email@example.com"
                />
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Phone</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input {...field} className="form-field" placeholder="+977-…" />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">City</label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-field"
                  placeholder="Kathmandu"
                />
              )}
            />
          </div>
          <div>
            <label className="form-label">Credit Limit (NPR)</label>
            <Controller
              name="creditLimit"
              control={control}
              rules={{ min: { value: 0, message: "Must be 0 or more" } }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="form-field"
                  min={0}
                />
              )}
            />
            {errors.creditLimit && (
              <p className="text-xs text-red-500 mt-1">
                {errors.creditLimit.message}
              </p>
            )}
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
            "Create Customer"
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
