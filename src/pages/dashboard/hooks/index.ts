import { useQuery } from "@tanstack/react-query";
import { getKpis } from "../services";

export const useKpis = (types: any) => {
  return useQuery({
    queryKey: [`${types}`],
    queryFn: async () => {
      const res = await getKpis(types);
      return res.data;
    },
  });
};
