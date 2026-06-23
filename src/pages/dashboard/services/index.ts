import { request } from "../../../api/axiosConfig";
import { endpoints } from "../../../api/endpoints";

export const getKpis = ({ types }) => {
  return request<{ data: any }>({
    url: `${endpoints.reports}/${types}`,
    method: "GET",
  });
};
