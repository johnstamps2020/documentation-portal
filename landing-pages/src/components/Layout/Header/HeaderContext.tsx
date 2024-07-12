import { HeaderOptions } from 'components/Layout/Header/Header';
import { createContext, useState, useContext, useEffect } from 'react';
import { usePageData } from 'hooks/usePageData';

interface HeaderContextInterface {
  headerOptions: HeaderOptions;
  setHeaderOptions: React.Dispatch<React.SetStateAction<HeaderOptions>>;
}

export const HeaderContext = createContext<HeaderContextInterface | null>(null);

export function HeaderContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerOptions, setHeaderOptions] = useState({});
  const { pageData } = usePageData();

  useEffect(() => {
    if (pageData?.searchFilters) {
      setHeaderOptions((prevHeaderOptions) => ({
        ...prevHeaderOptions,
        searchFilters: pageData.searchFilters,
      }));
    }
  }, [pageData]);

  return (
    <HeaderContext.Provider
      value={{
        headerOptions,
        setHeaderOptions,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const value = useContext(HeaderContext);

  if (!value) {
    throw new Error(
      'useHeaderContext must be used within HeaderContextProvider'
    );
  }

  return value;
}
