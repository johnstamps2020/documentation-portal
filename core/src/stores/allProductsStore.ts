import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Product } from '../model/entity';

interface AllProductsState {
  allProducts: Product[] | undefined;
  initializeAllProducts: (products: Product[]) => void;
}

const sessionStorage: PersistStorage<AllProductsState> = {
  getItem: (name) => {
    const item = window.sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    window.sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    window.sessionStorage.removeItem(name);
  },
};

export const useAllProductsStore = create<AllProductsState>()(
  persist(
    (set) => ({
      allProducts: undefined,
      initializeAllProducts: (products) => set({ allProducts: products }),
    }),
    { name: 'all-products', storage: sessionStorage }
  )
);
