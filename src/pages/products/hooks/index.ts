import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAddProducts,
  getDetailProducts,
  getProducts,
  getUpdateProducts,
  postStockAdjustment,
} from "../services";

export const useProducts = (params?: any) => {
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

export const useDetailProducts = (params?: any) => {
  return useQuery({
    queryKey: ["product-detail", params],
    queryFn: async () => {
      const res = await getDetailProducts(params);
      return res.data;
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

export const useUpdateProducts = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      getUpdateProducts(id, data),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useStockAdjustment = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => postStockAdjustment(body),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
