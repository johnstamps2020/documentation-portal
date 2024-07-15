import { PageItemsResponse } from '@doctools/server';
import React, { createContext, useContext } from 'react';

export interface LandingPageItemsInterface {
  allAvailableItems: PageItemsResponse | undefined;
}

export const LandingPageItemsContext =
  createContext<LandingPageItemsInterface | null>(null);

type LandingPageItemsProviderProps = {
  children: React.ReactNode;
  allAvailableItems: LandingPageItemsInterface['allAvailableItems'];
};

export function LandingPageItemsProvider({
  children,
  allAvailableItems,
}: LandingPageItemsProviderProps) {
  return (
    <LandingPageItemsContext.Provider
      value={{
        allAvailableItems,
      }}
    >
      {children}
    </LandingPageItemsContext.Provider>
  );
}

export function useLandingPageItemsContext() {
  const context = useContext(LandingPageItemsContext);
  if (!context) {
    throw new Error(
      'useLandingPageItems must be used within a LandingPageItemsProvider'
    );
  }
  return context;
}
