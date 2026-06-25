import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentRequest,
  getCustomerActiveOrdersRequest,
  getPaymentById,
  getPaymentList,
} from "../service";

export function usePaymentList({
  page,
  limit,
  filters,
}: {
  page: number;
  limit: number;
  filters: any;
}) {
  return useQuery({
    queryKey: ["payments", { page, limit, ...filters }],
    queryFn: () => getPaymentList(page, limit, filters),
  });
}

export function usePaymentDetails(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });
}

export function useCustomerActiveOrders(customerId: string) {
  return useQuery({
    queryKey: ["customer-active-orders", customerId],
    queryFn: () => getCustomerActiveOrdersRequest(customerId),
    enabled: !!customerId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: (newPayment) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["customer-active-orders", newPayment.customerId],
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}