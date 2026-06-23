import { request } from "../api/axiosConfig";
import { endpoints } from "../api/endpoints";

export const getCustomersTypes = () => {
  return request<{ data: any }>({
    url: `${endpoints.customerTypes}`,
    method: "GET",
  });
};

export const getUnitOfMeasure = () => {
  return request<{ data: any }>({
    url: `${endpoints.unitOfMeasure}`,
    method: "GET",
  });
};

export const getCategories = () => {
  return request<{ data: any }>({
    url: `${endpoints.categories}`,
    method: "GET",
  });
};
