// TODO save selected filters to sessionStorage if user changes them? Retrieve when returning to same landing page?
// TODO move all translated strings to separate file and import?
// TODO Set focus on search box on close

import { createContext, useContext, useEffect, useReducer } from 'react';
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
  allFilters:
    | { release: Release[] | undefined; product: Product[] | undefined }
    | undefined;
  helpWidth: React.CSSProperties['width']; // currently unused
}

const initialState: SearchHeaderLayoutContextInterface = {
  isMenuExpanded: false,
  isFiltersExpanded: false,
  defaultFilters: {},
  searchFilters: {},
  allFilters: undefined,
  helpWidth: '60ch', // not used
};

type Action =
  | { type: 'SET_MENU_EXPANDED'; payload: boolean }
  | { type: 'SET_FILTERS_EXPANDED'; payload: boolean }
  | { type: 'SET_DEFAULT_FILTERS'; payload: Filters }
  | { type: 'SET_SELECTED_FILTERS'; payload: Filters }
  | {
      type: 'SET_ALL_FILTERS';
      payload: {
        release: Release[] | undefined;
        product: Product[] | undefined;
      };
    };

function reducer(
  state: SearchHeaderLayoutContextInterface,
  action: Action
): SearchHeaderLayoutContextInterface {
  switch (action.type) {
    case 'SET_MENU_EXPANDED':
      return { ...state, isMenuExpanded: action.payload };
    case 'SET_FILTERS_EXPANDED':
      return { ...state, isFiltersExpanded: action.payload };
    case 'SET_DEFAULT_FILTERS':
      return { ...state, defaultFilters: action.payload };
    case 'SET_SELECTED_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'SET_ALL_FILTERS':
      return { ...state, allFilters: action.payload };
    default:
      return state;
  }
}

export const SearchHeaderLayoutContext = createContext<{
  state: SearchHeaderLayoutContextInterface;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function SearchHeaderLayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setHeaderOptions } = useHeaderContext();
  const { pageData } = usePageData();
  const { releases: allReleases } = useReleasesNoRevalidation();
  const { products: allProducts } = useProductsNoRevalidation();

  useEffect(() => {
    if (allReleases) {
      allReleases.sort((a: Release, b: Release) =>
        b.name.localeCompare(a.name)
      );
    }
    if (allProducts) {
      allProducts.sort((a: Product, b: Product) =>
        a.name.localeCompare(b.name)
      );
    }
    dispatch({
      type: 'SET_ALL_FILTERS',
      payload: { release: allReleases, product: allProducts },
    });
  }, [allReleases, allProducts]);

  useEffect(() => {
    if (pageData?.searchFilters) {
      const defaultFilters: Filters = {};
      Object.keys(pageData?.searchFilters).forEach((k) => {
        defaultFilters[k] = pageData?.searchFilters![k];
      });
      dispatch({
        type: 'SET_DEFAULT_FILTERS',
        payload: defaultFilters,
      });
    }
  }, [pageData]);

  useEffect(() => {
    setHeaderOptions((prevHeaderOptions) => ({
      ...prevHeaderOptions,
      searchFilters: state.searchFilters,
    }));
  }, [state.searchFilters, setHeaderOptions]);

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_FILTERS', payload: state.defaultFilters });
  }, [state.defaultFilters]);

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
