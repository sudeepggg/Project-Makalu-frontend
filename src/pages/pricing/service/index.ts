import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getPricingOverride = (body: any) => {
  return request<{ data: any }>({
    url: `${endpoints.pricing}/override`,
    method: "POST",
    data: body,
  });
};

export const getPriceLists = (customerId: string) => {
  return request<{ data: any }>({
    url: `${endpoints.pricing}/customer/${customerId}/compare`,
    method: "GET",
  });
};
