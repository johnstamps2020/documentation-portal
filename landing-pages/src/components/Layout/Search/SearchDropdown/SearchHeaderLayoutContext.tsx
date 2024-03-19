// TODO save selected filters to sessionStorage if user changes them? Retrieve when returning to same landing page?
// TODO move all translated strings to separate file and import?
// TODO Set focus on search box on close
// TODO use a reducer for searchFilter state changes

import { createContext, useState, useContext, useEffect } from 'react';
import { useLayoutContext } from 'LayoutContext';
import {
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
} from 'hooks/useApi';
import { Release, Product } from '@doctools/server';
import { useLocation } from 'react-router-dom';
import { usePageData } from 'hooks/usePageData';

type Filters = { [key: string]: string[] };

interface SearchHeaderLayoutContextInterface {
  isMenuExpanded: boolean;
  setIsMenuExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isFiltersExpanded: boolean;
  setIsFiltersExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  defaultFilters: Filters;
  searchFilters: Filters;
  setSearchFilters: React.Dispatch<React.SetStateAction<Filters>>;
  allFilters:
    | { release: Release[] | undefined; product: Product[] | undefined }
    | undefined;
  helpWidth: React.CSSProperties['width']; // currently unused
}

export const SearchHeaderLayoutContext =
  createContext<SearchHeaderLayoutContextInterface | null>(null);

export function SearchHeaderLayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const { setHeaderOptions } = useLayoutContext();
  const [searchFilters, setSearchFilters] = useState<Filters>({});
  const [initialFiltersSet, setInitialFiltersSet] = useState(false);

  const { pageData, isError } = usePageData(); // TODO handle error
  const location = useLocation();

  const helpWidth = '60ch'; // not used

  const { releases: allReleases } = useReleasesNoRevalidation();
  const { products: allProducts } = useProductsNoRevalidation();

  allReleases?.sort((a: Release, b: Release) => b.name.localeCompare(a.name));
  allProducts?.sort((a: Product, b: Product) => a.name.localeCompare(b.name));

  const allFilters = {
    release: allReleases,
    product: allProducts,
  };

  // set default filters
  const defaultFilters: Filters = {};
  if (pageData?.searchFilters) {
    Object.keys(pageData?.searchFilters).forEach((k) => {
      defaultFilters[k] = pageData?.searchFilters![k];
    });
  }

  if (!initialFiltersSet && Object.keys(defaultFilters).length > 0) {
    setSearchFilters(defaultFilters);
    setInitialFiltersSet(true);
  }

  useEffect(() => {
    setInitialFiltersSet(false);
  }, [location.pathname]);

  useEffect(() => {
    setHeaderOptions((prevHeaderOptions) => ({
      ...prevHeaderOptions,
      searchFilters: searchFilters,
    }));
  }, [searchFilters, setHeaderOptions]);

  return (
    <SearchHeaderLayoutContext.Provider
      value={{
        isMenuExpanded,
        setIsMenuExpanded,
        isFiltersExpanded,
        setIsFiltersExpanded,
        defaultFilters,
        searchFilters,
        setSearchFilters,
        allFilters,
        helpWidth,
      }}
    >
      {children}
    </SearchHeaderLayoutContext.Provider>
  );
}

export function useSearchHeaderLayoutContext() {
  const value = useContext(SearchHeaderLayoutContext);

  if (!value) {
    throw new Error(
      'useSearchHeaderLayoutContext must be used within SearchHeaderLayoutContextProvider'
    );
  }

  return value;
}
