import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAddSupplier, getSupplierDetails, getSuppliers } from "../service";

export const useSuppliers = (options?: any) => {
  return useQuery({
    queryKey: ["suppliers", options?.search, options?.page, options?.limit],
    queryFn: async () => {
      const res = await getSuppliers({
        search: options?.search,
        page: options?.page || 1,
        limit: options?.limit || 20,
      });
      return {
        data: res.data || [],
        pagination: res.data.pagination,
      } as any;
    },
  });
};

export const useSupplierDetails = (id: any) => {
  return useQuery({
    queryKey: ["suppliers-details", id],
    queryFn: async () => {
      const res = await getSupplierDetails({ id });
      return res.data;
    },
  });
};

export const useAddSupplier = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => getAddSupplier(body),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
