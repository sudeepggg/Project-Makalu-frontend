import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPriceComparisonList, getPriceHistory, savePricingOverride } from "../service";

export const usePriceLists = (customerId: string) => {
  return useQuery({
    queryKey: ["price-lists", customerId],
    queryFn: async () => {
      const res = await getPriceComparisonList(customerId);
      return res.data;
    },
  });
};

export const usePriceHistory = (customerId: string) => {
  return useQuery({
    queryKey: ["price-history", customerId],
    queryFn: async () => {
      const res = await getPriceHistory(customerId);
      return res.data;
    },
  });
};

export const useSavePricingOverride = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => savePricingOverride(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pricing-lists","pricing-history"] });
    },
  });
};
