import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { endpoints } from "../api/endpoints";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const r = await api.get(endpoints.customers);
      return r.data.data.data || r.data.data;
    },
  });
}
