import { usePaymentDetails } from "./hooks";

interface Props {
  id: string;
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{label}</span>
    <span className="text-sm text-gray-800 text-right">{children}</span>
  </div>
);

const PaymentDetail = ({ id }: Props) => {
  const { data: payment, isLoading, isError } = usePaymentDetails(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        Loading...
      </div>
    );

  if (isError || !payment)
    return (
      <p className="text-sm text-red-500 py-6 text-center">
        Could not load payment details.
      </p>
    );

  const statusKey = payment.status?.toLowerCase();

  return (
    <div className="divide-y divide-gray-100">
      <DetailRow label="Date">
        {new Date(payment.paymentDate).toLocaleDateString()}
      </DetailRow>

      <DetailRow label="Customer">
        {payment.customer?.name ?? "—"}
      </DetailRow>

      <DetailRow label="Order">
        {payment.order?.orderNumber ?? payment.orderId?.slice(0, 8)}
      </DetailRow>

      <DetailRow label="Amount">
        <span className="font-semibold text-gray-900">
          ${payment.amount?.toFixed(2)}
        </span>
      </DetailRow>

      <DetailRow label="Method">{payment.method}</DetailRow>

      <DetailRow label="Status">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            STATUS_COLORS[statusKey] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {payment.status}
        </span>
      </DetailRow>

      {payment.reference && (
        <DetailRow label="Reference">{payment.reference}</DetailRow>
      )}

      {payment.notes && (
        <DetailRow label="Notes">
          <span className="whitespace-pre-wrap">{payment.notes}</span>
        </DetailRow>
      )}
    </div>
  );
};

export default PaymentDetail;