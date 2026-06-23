import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConfirmOrder,
  getOrderByCustomer,
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
    mutationFn: (action: string) => getConfirmOrder(orderId, action),
    onMutate: async (action) => {
      await qc.cancelQueries({ queryKey: ["orders-details", orderId] });
      const previous = qc.getQueryData(["orders-details", orderId]);

      const nextStatus: Record<string, string> = {
        confirm: "CONFIRMED",
        dispatch: "DISPATCHED",
        deliver: "DELIVERED",
      };

      qc.setQueryData(["orders-details", orderId], (old: any) =>
        old ? { ...old, status: nextStatus[action] ?? old.status } : old,
      );

      return { previous };
    },
    onError: (_err, _action, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(["orders-details", orderId], ctx.previous);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders-details", orderId] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCustomerActiveOrders = (customerId: string) => {
  return useQuery({
    queryKey: ["orders", "active", customerId],
    queryFn: () => getOrderByCustomer(customerId),
    enabled: !!customerId,
  });
};
