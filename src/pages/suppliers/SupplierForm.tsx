import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddSupplier } from "./hooks";

type FormValues = {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  registrationNumber: string;
  paymentTerms: string;
};

const SupplierForm: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { mutateAsync: addSupplier } = useAddSupplier();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      registrationNumber: "",
      paymentTerms: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await addSupplier(values);
      reset();
      onSaved?.();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to create supplier.",
      });
    }
  };

  return (
    <div className="fade-in">
      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Name */}
        <div>
          <label className="form-label">Name *</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } }}
            render={({ field }) => (
              <input
                {...field}
                className="form-field"
                placeholder="Supplier name"
              />
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Contact Person + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Contact Person</label>
            <Controller
              name="contactPerson"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-field"
                  placeholder="John Doe"
                />
              )}
            />
          </div>
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
                  placeholder="supplier@example.com"
                />
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone + Registration Number */}
        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="form-label">Registration Number</label>
            <Controller
              name="registrationNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-field"
                  placeholder="PAN/VAT No."
                />
              )}
            />
          </div>
        </div>

        {/* Street */}
        <div>
          <label className="form-label">Street Address</label>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="form-field"
                placeholder="123 Business Street"
              />
            )}
          />
        </div>

        {/* City + State + Zip Code */}
        <div className="grid grid-cols-3 gap-3">
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
            <label className="form-label">State</label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <input {...field} className="form-field" placeholder="State" />
              )}
            />
          </div>
          <div>
            <label className="form-label">Zip Code</label>
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-field"
                  placeholder="12345"
                />
              )}
            />
          </div>
        </div>

        {/* Country + Payment Terms */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-field"
                  placeholder="Nepal"
                />
              )}
            />
          </div>
          <div>
            <label className="form-label">Payment Terms</label>
            <Controller
              name="paymentTerms"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-field"
                  placeholder="Net 30"
                />
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
            "Create Supplier"
          )}
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;
