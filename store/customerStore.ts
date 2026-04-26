import create from 'zustand';
import { Customer } from '../types/customer';

type State = {
  customers: Customer[];
  setCustomers: (c: Customer[]) => void;
};

export const useCustomerStore = create<State>((set) => ({
  customers: [],
  setCustomers: (c) => set({ customers: c }),
}));