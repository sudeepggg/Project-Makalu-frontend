import { useQuery } from "@tanstack/react-query";
import { getPaymentList } from "../service";

export const usePaymentList = () => {
  return useQuery({
    queryKey: ["payment-list"],
    queryFn: async () => {
      const res = await getPaymentList();
      return res.data.data;
    },
  });
};
