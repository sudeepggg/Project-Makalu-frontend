import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { endpoints } from '../api/endpoints';

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const r = await api.get(endpoints.products, { params });
      const d = r.data.data;
      return { data: d.data || d, pagination: d.pagination };
    },
  });
}
