export type Customer = {
  id: string;
  name: string;
  customerTypeId?: string;
  email?: string;
  phone?: string;
  city?: string;
  creditLimit?: number;
  creditUsed?: number;
  isActive?: boolean;
};