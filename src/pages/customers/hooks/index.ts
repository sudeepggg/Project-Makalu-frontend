import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAddCustomers,
  getCustomers,
  getCustomersDetail
} from "../services";

export const useCustomers = (body: any) => {
  return useQuery({
    queryKey: ["customers", body],
    queryFn: async () => {
      const res = await getCustomers(body);
      return res.data;
    },
  });
};

export const useCustomersDetails = (id: any) => {
  return useQuery({
    queryKey: ["customers-details", id],
    queryFn: async () => {
      const res = await getCustomersDetail({ id });
      return res.data;
    },
  });
};



export const useAddCustomers = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => getAddCustomers(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
