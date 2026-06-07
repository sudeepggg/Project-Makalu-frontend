import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getOrders = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.orders}`,
    method: "GET",
    params: params,
  });
};

export const getOrdersDetails = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.orders}/${params.id}`,
    method: "GET",
  });
};

export const getSaveOrder = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.orders}`,
    method: "POST",
    data: params,
  });
};
export const getUpdateOrder = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.orders}/${params.id}`,
    method: "PUT",
    data: params,
  });
};

export const getConfirmOrder = (orderId: string, orderType: string) => {
  return request<{ data: any }>({
    url: `${endpoints.orders}/${orderId}/${orderType}`,
    method: "POST",
  });
};
