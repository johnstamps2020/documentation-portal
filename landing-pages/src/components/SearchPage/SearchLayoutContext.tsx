import { createContext, useState, useContext } from 'react';

interface SearchLayoutContextInterface {
  isHelpExpanded: boolean;
  setIsHelpExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isShowFiltersExpanded: boolean;
  setIsShowFiltersExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchLayoutContext =
  createContext<SearchLayoutContextInterface | null>(null);

export function SearchLayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const [isShowFiltersExpanded, setIsShowFiltersExpanded] = useState(false);

  return (
    <SearchLayoutContext.Provider
      value={{
        isHelpExpanded,
        setIsHelpExpanded,
        isShowFiltersExpanded,
        setIsShowFiltersExpanded,
      }}
    >
      {children}
    </SearchLayoutContext.Provider>
  );
}

export function useSearchLayoutContext() {
  const value = useContext(SearchLayoutContext);

  if (!value) {
    throw new Error(
      'useSearchLayoutContext must be used within SearchLayoutContextProvider'
    );
  }

  return value;
}
