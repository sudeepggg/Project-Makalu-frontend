import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getPaymentList = () => {
  return request<{ data: any }>({
    url: `${endpoints.payments}`,
    method: "GET",
  });
};
