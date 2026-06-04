import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getAddProducts = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.products}`,
    method: "POST",
    data: body,
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
