
export interface OrderItem {
  id: string | number;
  product: { sku: string; name: string };
  quantity: number;
  unitPrice: number;
  discountPercentage?: number;
  lineTotal: number;
}

export interface Payment {
  id: string | number;
  amount: number;
  paymentMethod: string;
  paymentDate?: string;
}

export interface Order {
  orderNumber: string;
  status: string;
  orderDate?: string;
  confirmedDate?: string;
  dispatchedDate?: string;
  deliveredDate?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    pan?: string; // PAN/VAT number for tax invoice
  };
  items?: OrderItem[];
  subtotal: number;
  total: number;
  payments?: Payment[];
}

export type BillType = "PURCHASE_ORDER" | "TAX_INVOICE" | "REGULAR_BILL";

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  pan?: string;       // PAN for tax invoice
  vatNumber?: string; // VAT registration number
  website?: string;
}

export interface OrderBillProps {
  order: Order;
  company?: CompanyInfo;
  billType?: BillType;
  taxRate?: number; // percentage e.g. 13 for 13% VAT
  onClose?: () => void;
}
