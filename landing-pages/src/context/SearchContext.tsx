import {
  SearchData,
  ServerSearchError
} from "@documentation-portal/dist/types/serverSearch";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface SearchInterface {
  searchData: SearchData | undefined;
  runSearch: () => void;
  loadingSearchData: boolean;
  loadingSearchDataError: ServerSearchError | undefined;
}

const SearchContext = createContext<SearchInterface | null>(null);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export function SearchProvider({ children }: SearchContextProviderProps) {
  const [searchData, setSearchData] = useState<SearchData | undefined>();
  const [loadingSearchData, setLoadingSearchData] = useState<boolean>(false);
  const [loadingSearchDataError, setLoadingSearchDataError] = useState<
    ServerSearchError | undefined
  >();
  const [searchParams] = useSearchParams();

  async function runSearch() {
    try {
      setLoadingSearchData(true);
      const response = await fetch(`/search?${searchParams.toString()}`);
      if (!response.ok) {
        const errorJson = await response.json();
        setLoadingSearchDataError({
          status: response.status,
          message: errorJson.message
        });
      }
      const jsonData = await response.json();
      setSearchData(jsonData);
    } catch (err) {
      setLoadingSearchDataError({
        status: 500,
        message: `Cannot fetch search data: ${err}`
      });
    } finally {
      setLoadingSearchData(false);
    }
  }

  useEffect(() => {
    runSearch().catch(e => e);
  }, [searchParams]);

  return (
    <SearchContext.Provider
      value={{
        searchData,
        runSearch,
        loadingSearchData,
        loadingSearchDataError
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const contextValue = useContext(SearchContext);

  if (!contextValue) {
    throw new Error("Please check that your page is wrapped in SearchProvider");
  }

  return contextValue;
};
