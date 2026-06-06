import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConfirmOrder,
  getOrders,
  getOrdersDetails,
  getSaveOrder,
} from "../services";

export const useOrders = (body: any) => {
  return useQuery({
    queryKey: ["orders", body],
    queryFn: async () => {
      const res = await getOrders(body);
      return res.data;
    },
  });
};

export const useOrdersDetails = (id: any) => {
  return useQuery({
    queryKey: ["orders-details", id],
    queryFn: async () => {
      const res = await getOrdersDetails({ id });
      return res.data;
    },
  });
};

export const useSaveOrder = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => getSaveOrder(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useConfirmOrder = (orderId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (orderType: string) => getConfirmOrder(orderId, orderType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders", orderId] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
