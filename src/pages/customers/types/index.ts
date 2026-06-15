export type Filters = {
  status: "" | "active" | "inactive";
  customerTypeId: string;
};

export type FormProps = {
  onSaved?: () => void;
  customer?: any | null;
};

export type FormValues = {
  name: string;
  customerTypeId: string;
  email: string;
  phone: string;
  alternatePhone: string;
  city: string;
  creditLimit: number;
};

export type DetailsProps = {
  id: string;
  onBack?: () => void;
};
