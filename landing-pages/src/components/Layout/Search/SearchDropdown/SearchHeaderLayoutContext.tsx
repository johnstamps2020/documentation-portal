// TODO save selected filters to sessionStorage if user changes them? Retrieve when returning to same landing page?
// TODO move all translated strings to separate file and import?

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
} from 'react';
import { useHeaderContext } from 'components/Layout/Header/HeaderContext';
import {
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
} from 'hooks/useApi';
import { Release, Product } from '@doctools/server';
import { usePageData } from 'hooks/usePageData';

export type Filters = { [key: string]: string[] };

interface SearchHeaderLayoutContextInterface {
  isMenuExpanded: boolean;
  isFiltersExpanded: boolean;
  defaultFilters: Filters;
  searchFilters: Filters;
  allFilters: Filters;
}

const initialState: SearchHeaderLayoutContextInterface = {
  isMenuExpanded: false,
  isFiltersExpanded: false,
  defaultFilters: {},
  searchFilters: {},
  allFilters: {},
};

type Action =
  | { type: 'SET_MENU_EXPANDED'; payload: boolean }
  | { type: 'SET_FILTERS_EXPANDED'; payload: boolean }
  | { type: 'SET_SELECTED_FILTERS'; payload: Filters };

function reducer(
  state: SearchHeaderLayoutContextInterface,
  action: Action
): SearchHeaderLayoutContextInterface {
  switch (action.type) {
    case 'SET_MENU_EXPANDED':
      return { ...state, isMenuExpanded: action.payload };
    case 'SET_FILTERS_EXPANDED':
      return { ...state, isFiltersExpanded: action.payload };
    case 'SET_SELECTED_FILTERS':
      return { ...state, searchFilters: action.payload };
    default:
      return state;
  }
}

export const SearchHeaderLayoutContext = createContext<{
  state: SearchHeaderLayoutContextInterface;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function SearchHeaderLayoutContextProvider({
  children, // add defaultFilters here due to different sources
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setHeaderOptions } = useHeaderContext();
  const { pageData } = usePageData();
  const { releases: allReleases } = useReleasesNoRevalidation();
  const { products: allProducts } = useProductsNoRevalidation();

  // need setter?
  state.allFilters = useMemo(() => {
    if (!allReleases || !allProducts) return { release: [], product: [] };
    return {
      release: allReleases
        .sort((a: Release, b: Release) => b.name.localeCompare(a.name))
        .map((r: Release) => r.name),
      product: allProducts
        .sort((a: Product, b: Product) => a.name.localeCompare(b.name))
        .map((p: Product) => p.name),
    };
  }, [allReleases, allProducts]);

  // need setter?
  state.defaultFilters = useMemo(() => {
    if (!pageData?.searchFilters) {
      return {};
    }
    const defaultFilters: Filters = {};
    Object.keys(pageData?.searchFilters).forEach((k) => {
      defaultFilters[k] = pageData?.searchFilters![k];
    });
    return defaultFilters;
  }, [pageData]);

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_FILTERS', payload: state.defaultFilters });
  }, [state.defaultFilters]);

  useEffect(() => {
    setHeaderOptions((prevHeaderOptions) => ({
      ...prevHeaderOptions,
      searchFilters: state.searchFilters,
    }));
  }, [state.searchFilters, setHeaderOptions]);

  return (
    <SearchHeaderLayoutContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchHeaderLayoutContext.Provider>
  );
}

export function useSearchHeaderLayoutContext() {
  const context = useContext(SearchHeaderLayoutContext);

  if (!context) {
    throw new Error(
      'useSearchHeaderLayoutContext must be used within SearchHeaderLayoutContextProvider'
    );
  }

  return context;
}
