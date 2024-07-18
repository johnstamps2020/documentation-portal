import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../model/entity';

interface AllProductsState {
  allProducts: Product[] | undefined;
  initializeAllProducts: (products: Product[]) => void;
}

export const useAllProductsStore = create<AllProductsState>()(
  persist(
    (set) => ({
      allProducts: undefined,
      initializeAllProducts: (products) => set({ allProducts: products }),
    }),
    { name: 'all-products' }
  )
);
