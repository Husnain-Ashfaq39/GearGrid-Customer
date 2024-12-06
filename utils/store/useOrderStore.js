import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set) => ({
      order: null,
      addOrder: (order) => set({ order }),
      clearOrder: () => set({ order: null }),
    }),
    {
      name: 'order-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useOrderStore; 