export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  registrationNumber?: string;
  paymentTerms?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  registrationNumber?: string;
  paymentTerms?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  registrationNumber?: string;
  paymentTerms?: string;
  isActive?: boolean;
}

export interface ListSupplierQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: "true" | "false";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}