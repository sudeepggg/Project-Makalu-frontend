import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPriceLists, getPricingOverride } from "../service";

export const usePriceLists = (customerId: string) => {
  return useQuery({
    queryKey: ["price-lists", customerId],
    queryFn: async () => {
      const res = await getPriceLists(customerId);
      return res.data;
    },
  });
};

export const useSavePricingOverride = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => getPricingOverride(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pricing-lists"] });
    },
  });
};
