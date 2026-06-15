export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUSES;

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  method: string;
  reference?: string | null;
  notes?: string | null;
  status: PaymentStatus;
  paymentDate: string;
  order?: {
    id: string;
    orderNumber?: string;
    total: number;
    items?: Array<{
      id: string;
      quantity: number;
      price: number;
      product?: { id: string; name: string };
    }>;
  };
  customer?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface PaymentListResponse {
  data: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaymentFilters {
  status?: PaymentStatus;
  customerId?: string;
}

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CARD', label: 'Card' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'OTHER', label: 'Other' },
];
