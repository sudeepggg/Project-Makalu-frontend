import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAddProducts, getProducts } from "../services";

export const useProducts = (params: any) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await getProducts(params);
      return {
        data: res.data.data || [],
        pagination: res.data.pagination,
      };
    },
  });
};

export const useAddProducts = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => getAddProducts(body),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
