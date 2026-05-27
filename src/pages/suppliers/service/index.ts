import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getSuppliers = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.suppliers}`,
    method: "GET",
    params: body,
  });
};

export const getAddSupplier = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.suppliers}`,
    method: "POST",
    data: body,
  });
};

export const getSupplierDetails = (params: any) => {
  return request<{ data: any }>({
    url: `${endpoints.suppliers}/${params.id}`,
    method: "GET",
  });
};
