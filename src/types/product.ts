export type Product = {
  id: string;
  sku: string;
  name: string;
  basePrice: number;
  costPrice?: number;
  isActive?: boolean;
};