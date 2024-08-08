// TODO save selected filters to sessionStorage if user changes them? Retrieve when returning to same landing page?
// TODO move all translated strings to separate file and import?
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Product, Release } from '../../model/entity';
import { useAllProductsStore } from '../../stores/allProductsStore';
import { useAllReleasesStore } from '../../stores/allReleasesStore';
import { useAllVersionsStore } from '../../stores/allVersionsStore';
import { useEnvStore } from '../../stores/envStore';

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
  children,
  defaultFilters,
  setFilters,
}: {
  children: React.ReactNode;
  defaultFilters: Filters;
  setFilters: (searchFilters: Filters) => void;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  state.defaultFilters = defaultFilters;

  const envName = useEnvStore((state) => state.envName);
  const allProducts = useAllProductsStore((state) => state.allProducts);
  const allReleases = useAllReleasesStore((state) => state.allReleases);
  const allVersions = useAllVersionsStore((state) => state.allVersions);

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

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_FILTERS', payload: state.defaultFilters });
  }, [state.defaultFilters]);

  useEffect(() => {
    setFilters(state.searchFilters);
  }, [state.searchFilters, setFilters]);

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
