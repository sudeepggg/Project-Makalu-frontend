import { useQuery } from "@tanstack/react-query";
import { getCategories, getCustomersTypes, getUnitOfMeasure } from "../services";

export const useCustomersTypes = () => {
  return useQuery({
    queryKey: ["customers-types"],
    queryFn: async () => {
      const res = await getCustomersTypes();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUnitOfMeasure = () => {
  return useQuery({
    queryKey: ["unit-of-measure"],
    queryFn: async () => {
      const res = await getUnitOfMeasure();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};