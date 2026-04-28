import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { endpoints } from "../api/endpoints";

export function useCustomers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const r = await api.get(endpoints.customers, { params });
      const d = r.data.data;
      return { data: d.data || d, pagination: d.pagination };
    },
  });
}
