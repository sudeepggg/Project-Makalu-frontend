import create from 'zustand';

type State = {
  inventory: any[];
  setInventory: (i: any[]) => void;
};

export const useInventoryStore = create<State>((set) => ({
  inventory: [],
  setInventory: (i) => set({ inventory: i }),
}));