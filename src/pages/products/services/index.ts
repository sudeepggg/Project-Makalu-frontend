import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getAddProducts = (body: FormData) => {
  return request<{ data: any }>({
    url: `${endpoints.products}`,
    method: "POST",
    data: body,
    // headers:{
    //   contentType: "multipart/form-data"
    // }
  });
};

export const getUpdateProducts = (id: string, formData: FormData) => {
  return request<{ data: any }>({
    url: `${endpoints.products}/${id}`,
    method: "PUT",
    data: formData,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // }
  });
};

export const getDetailProducts = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.products}/${body.id}`,
    method: "GET",
  });
};

export const getProducts = (params: any) => {
  return request<{
    data: {
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }>({
    url: endpoints.products,
    method: "GET",
    params,
  });
};

export const postStockAdjustment = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.inventory}/adjust`,
    method: "POST",
    data: body,
  });
};

export const toggleProduct = (body: { id: string; isActive: boolean }) => {
  return request<{ data: any }>({
    url: `${endpoints.products}/${body.id}/toggle-active`,
    method: "PATCH",
    data: { isActive: body.isActive },
  });
};
