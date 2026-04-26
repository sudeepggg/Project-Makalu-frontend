import create from 'zustand';
import { Order } from '../types/order';

type State = {
  orders: Order[];
  setOrders: (o: Order[]) => void;
};

export const useOrderStore = create<State>((set) => ({
  orders: [],
  setOrders: (o) => set({ orders: o }),
}));