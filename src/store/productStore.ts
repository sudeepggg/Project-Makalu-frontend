import { create } from "zustand";
import type { Product } from "../types/product";


type State = {
  products: Product[];
  setProducts: (p: Product[]) => void;
};

export const useProductStore = create<State>((set) => ({
  products: [],
  setProducts: (p) => set({ products: p }),
}));