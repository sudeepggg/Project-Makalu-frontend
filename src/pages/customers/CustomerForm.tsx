import { Controller, useForm } from "react-hook-form";
import { useCustomersTypes } from "../../hooks";
import { useAddCustomers, useUpdateCustomers } from "./hooks";

type FormValues = {
  name: string;
  customerTypeId: string;
  email: string;
  phone: string;
  alternatePhone: string;
  city: string;
  creditLimit: number;
};

type Props = {
  onSaved?: () => void;
  customers?: any[];
};

const CustomerForm = ({ customers,onSaved }: Props) => {
  const { mutateAsync: addCustomer } = useAddCustomers();
  const { mutateAsync: updateCustomer } = useUpdateCustomers();
  const { data: customerTypes, isLoading: typesLoading } = useCustomersTypes();
  const isEdit = Boolean(customers);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: isEdit ? customers?.[0]?.name || "" : "",
      customerTypeId: isEdit ? customers?.[0]?.customerTypeId || "" : "",
      email: isEdit ? customers?.[0]?.email || "" : "",
      phone: isEdit ? customers?.[0]?.phone || "" : "",
      alternatePhone: isEdit ? customers?.[0]?.alternatePhone || "" : "",
      city: isEdit ? customers?.[0]?.city || "" : "",
      creditLimit: isEdit ? customers?.[0]?.creditLimit || 0 : 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      isEdit
        ? await updateCustomer({
            ...values,
            creditLimit: Number(values.creditLimit),
            phone: values.phone || undefined,
            alternatePhone: values.alternatePhone || null,
            email: values.email || undefined,
            id: customers?.[0]?.id,
          })
        : await addCustomer({
            ...values,
            creditLimit: Number(values.creditLimit),
            phone: values.phone || undefined,
            alternatePhone: values.alternatePhone || null,
            email: values.email || undefined,
          });
          onSaved?.();
      reset();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to create customer.",
      });
    }
  };

  return (
    <div className="">
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

        {/* Customer Type ← added */}
        <div>
          <label className="form-label">Customer Type *</label>
          <Controller
            name="customerTypeId"
            control={control}
            rules={{ required: "Customer type is required" }}
            render={({ field }) => (
              <select {...field} className="form-field" disabled={typesLoading}>
                <option value="">
                  {typesLoading ? "Loading..." : "Select type"}
                </option>
                {customerTypes?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.customerTypeId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.customerTypeId.message}
            </p>
          )}
        </div>

        {/* Email + Phone */}
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
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
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
            <label className="form-label">Alternate Phone</label>
            <Controller
              name="alternatePhone"
              control={control}
              render={({ field }) => (
                <input {...field} className="form-field" placeholder="+977-…" />
              )}
            />
          </div>
        </div>

        {/* City + Credit Limit */}
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
              rules={{
                required: "Credit limit is required",
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
            {errors.creditLimit && (
              <p className="text-xs text-red-500 mt-1">
                {errors.creditLimit.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || typesLoading}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Saving…
            </>
          ) : isEdit ? (
            "Update Customer"
          ) : (
            "Create Customer"
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
