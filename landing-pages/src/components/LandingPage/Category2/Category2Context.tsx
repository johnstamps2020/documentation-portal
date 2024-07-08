import { LandingPageItemData } from 'hooks/hookTypes';
import React, { createContext, useContext } from 'react';

export interface Category2Interface {
  allAvailableItems: LandingPageItemData[];
}

export const Category2Context = createContext<Category2Interface | null>(null);

type Category2ProviderProps = {
  children: React.ReactNode;
  allAvailableItems: Category2Interface['allAvailableItems'];
};

export function Category2Provider({
  children,
  allAvailableItems,
}: Category2ProviderProps) {
  return (
    <Category2Context.Provider
      value={{
        allAvailableItems,
      }}
    >
      {children}
    </Category2Context.Provider>
  );
}

export function useCategory2Context() {
  const context = useContext(Category2Context);
  if (!context) {
    throw new Error('useCategory2 must be used within a ChatProvider');
  }
  return context;
}
