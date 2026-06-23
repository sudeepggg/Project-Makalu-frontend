import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const savePricingOverride = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.pricing}/override`,
    method: "POST",
    data: body,
  });
};

export const getPriceComparisonList = (customerId: string) => {
  return request<{ data: any }>({
    url: `${endpoints.pricing}/customer/${customerId}/compare`,
    method: "GET",
  });
};

export const getPriceHistory = (customerId: string) => {
  return request<{ data: any }>({
    url: `${endpoints.pricing}/customer/${customerId}/history`,
    method: "GET",
  });
};