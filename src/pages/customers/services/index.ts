import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getCustomers = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.customers}`,
    method: "GET",
    params: params,
  });
};
export const getCustomersDetail = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.customers}/${params.id}`,
    method: "GET",
  });
};


export const getAddCustomers = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.customers}`,
    method: "POST",
    data: body,
  });
};
