import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getPaymentList = (page = 1, limit = 20, filters?: any) => {
  return request<any>({
    url: endpoints.payments,
    method: "GET",
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const getPaymentById = (id: string) => {
  return request<any>({
    url: `${endpoints.payments}/${id}`,
    method: "GET",
  });
};

export const createPaymentRequest = (data: {
  customerId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  paymentDate: string;
  notes?: string;
}) => {
  return request<any>({
    url: endpoints.payments,
    method: "POST",
    data,
  });
};

export const getCustomerActiveOrdersRequest = (customerId: string) => {
  return request<any>({
    url: `${endpoints.customers}/${customerId}/active-orders`,
    method: "GET",
  });
};
