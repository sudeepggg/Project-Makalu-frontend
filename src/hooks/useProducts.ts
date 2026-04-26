import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { endpoints } from '../api/endpoints';

export function useProducts() {
  return useQuery(['products'], async () => {
    const r = await api.get(endpoints.products);
    return r.data.data.data || r.data.data;
  });
}