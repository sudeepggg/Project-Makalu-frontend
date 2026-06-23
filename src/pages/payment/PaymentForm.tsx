import { useEffect, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useCustomers } from "../customers/hooks";
import { useCustomerActiveOrders, useCreatePayment } from "./hooks";
import { PAYMENT_METHODS } from "./types";
import SelectField from "../../components/ContolledFields/SelectField";

interface PaymentFormValues {
  customerId: string;
  orderId: string;
  amount: number;
  method: string;
  reference: string;
  paymentDate: string;
  notes: string;
}

interface Props {
  onSuccess: () => void;
}

export function RecordPaymentForm({ onSuccess }: Props) {
  const createPayment = useCreatePayment();
  const { data: customers, isLoading: loadingCustomers } = useCustomers();

  const methods = useForm<PaymentFormValues>({
    defaultValues: {
      customerId: "",
      orderId: "",
      amount: 0,
      method: "CASH",
      reference: "",
      paymentDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedCustomerId = useWatch({ control, name: "customerId" });
  const watchedOrderId = useWatch({ control, name: "orderId" });

  const { data: activeOrders, isLoading: loadingOrders } =
    useCustomerActiveOrders(watchedCustomerId);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<{
    total: number;
    outstanding: number;
  } | null>(null);

  useEffect(() => {
    setValue("orderId", "");
    setValue("customerId", "");
    setSelectedOrderDetails(null);
  }, [watchedCustomerId, setValue]);

  useEffect(() => {
    if (watchedOrderId && activeOrders) {
      const match = activeOrders.find((o) => o.id === watchedOrderId);
      if (match) {
        setSelectedOrderDetails({
          total: match.total,
          outstanding: match.outstanding,
        });
      }
    } else {
      setSelectedOrderDetails(null);
    }
  }, [watchedOrderId, activeOrders]);

  const customerOptions =
    customers?.data?.map((c: any) => ({ value: c.id, label: c.name })) ?? [];

  const orderOptions =
    activeOrders?.map((o) => ({
      value: o.id,
      label: `${o.orderNumber ?? o.id.slice(0, 8)} (Total: $${o.total.toFixed(2)})`,
    })) ?? [];

  const onSubmit = async (data: PaymentFormValues) => {
    if (data.amount <= 0) {
      setError("amount", {
        type: "manual",
        message: "Amount must be greater than 0",
      });
      return;
    }
    if (
      selectedOrderDetails &&
      data.amount > selectedOrderDetails.outstanding
    ) {
      setError("amount", {
        type: "manual",
        message: `Overpayment: exceeds outstanding balance ($${selectedOrderDetails.outstanding.toFixed(2)})`,
      });
      return;
    }
    try {
      await createPayment.mutateAsync(data);
      onSuccess();
    } catch (err: any) {
      setError("root", {
        type: "server",
        message: err?.message || "Failed to record payment",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Root error */}
        {errors.root && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {errors.root.message}
          </div>
        )}

        {/* Customer */}
        <SelectField
          name="customerId"
          label="Customer *"
          options={customerOptions}
          placeholder="Select a customer..."
          isLoading={loadingCustomers}
          rules={{ required: "Customer is required" }}
        />

        {/* Order */}
        <SelectField
          name="orderId"
          label="Active Sales Order *"
          options={orderOptions}
          placeholder={
            watchedCustomerId
              ? "Select confirmed order..."
              : "Choose a customer first"
          }
          isLoading={loadingOrders}
          rules={{ required: "Order selection is required" }}
        />

        {/* Order balance card */}
        {selectedOrderDetails && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Order Total</p>
              <p className="font-semibold text-gray-800">
                ${selectedOrderDetails.total.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Outstanding Balance</p>
              <p className="font-semibold text-blue-700">
                ${selectedOrderDetails.outstanding.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="amount">
            Payment Amount ($) *
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
            })}
          />
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Method + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="method"
            >
              Payment Method *
            </label>
            <select
              id="method"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("method")}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="paymentDate"
            >
              Payment Date *
            </label>
            <input
              id="paymentDate"
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("paymentDate", { required: "Date is required" })}
            />
          </div>
        </div>

        {/* Reference */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="reference"
          >
            Reference / Transaction ID
          </label>
          <input
            id="reference"
            type="text"
            placeholder="e.g. Txn #98432 or Cheque number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("reference")}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Internal collection details..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            {...register("notes")}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Recording..." : "Record Payment"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
