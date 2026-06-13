import { FormProvider, useForm } from "react-hook-form";
import InputField from "../../components/ContolledFields/InputField";
import SelectField from "../../components/ContolledFields/SeleectField";
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
  customer?: any | null;
};

const CustomerForm = ({ customer, onSaved }: Props) => {
  const { mutateAsync: addCustomer } = useAddCustomers();
  const { mutateAsync: updateCustomer } = useUpdateCustomers();
  const { data: customerTypes, isLoading: typesLoading } = useCustomersTypes();

  const isEdit = Boolean(customer);

  const methods = useForm<FormValues>({
    defaultValues: {
      name: customer?.name ?? "",
      customerTypeId: customer?.customerTypeId ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      alternatePhone: customer?.alternatePhone ?? "",
      city: customer?.city ?? "",
      creditLimit: customer?.creditLimit ?? 0,
    },
  });

  const {
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = methods;

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        creditLimit: Number(values.creditLimit),
        phone: values.phone || undefined,
        alternatePhone: values.alternatePhone || null,
        email: values.email || undefined,
      };

      if (isEdit) {
        await updateCustomer({ ...payload, id: customer.id });
      } else {
        await addCustomer(payload);
      }

      onSaved?.();
      reset();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Failed to save customer.",
      });
    }
  };
  const typeOptions =
    customerTypes?.map((t: any) => ({
      label: t.name,
      value: t.id,
    })) ?? [];

  return (
    <div>
      {errors.root && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {errors.root.message}
        </div>
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3">
          {/* Name */}
          <InputField
            name="name"
            label="Name *"
            placeholder="Customer name"
            rules={{ required: "Name is required" }}
          />

          {/* Customer Type */}
          <SelectField
            name="customerTypeId"
            label="Customer Type *"
            placeholder="Select type"
            options={typeOptions}
            isLoading={typesLoading}
            rules={{ required: "Customer type is required" }}
          />

          {/* Email */}
          <InputField
            name="email"
            label="Email"
            placeholder="email@example.com"
            type="email"
            rules={{
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            }}
          />

          {/* Phone */}
          <div className="grid grid-cols-2 gap-3">
            <InputField name="phone" label="Phone" placeholder="+977-…" />
            <InputField
              name="alternatePhone"
              label="Alternate Phone"
              placeholder="+977-…"
            />
          </div>

          {/* City + Credit Limit */}
          <div className="grid grid-cols-2 gap-3">
            <InputField name="city" label="City" placeholder="Kathmandu" />
            <InputField
              name="creditLimit"
              label="Credit Limit (NPR)"
              placeholder="Kathmandu"
              type="number"
              rules={{
                required: "Credit limit is required",
                min: { value: 0, message: "Must be 0 or more" },
              }}
            />
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
      </FormProvider>
    </div>
  );
};

export default CustomerForm;
