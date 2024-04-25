import React, { useMemo, useState } from 'react';
import HiddenInput from './HiddenInput';
import SearchInput from './SearchInput';
import { SearchBox } from '@doctools/components';
import { translate } from '@doctools/components';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  SearchHeaderLayoutContextProvider,
  SearchHeadWrapper,
  Filters,
} from '@doctools/components';

type SearchFilters = {
  release?: string[];
  version?: string[];
  platform?: string[];
  product?: string[];
  language?: string[];
};

export default function OnlineSearch() {
  //const defaultFilters: Filters = {};
  const placeholder = translate({
    id: 'gwSearchForm.placeholder',
    message: 'Search',
  });
  const defaultFilters = useMemo(() => {
    const df: Filters = {};
    // if (window.docPlatform) {
    //   df.platform = [window.docPlatform];
    // }
    if (window.docPlatform.includes('Cloud') && window.docRelease) {
      df.release = [window.docRelease];
    }
    if (window.docPlatform.includes('Self-managed') && window.docVersion) {
      df.version = [window.docVersion];
    }
    if (window.docProduct) {
      df.product = [window.docProduct];
    }
    if (window.docLanguage) {
      df.language = [window.docLanguage];
    }
    return df;
  }, [
    window.docPlatform,
    window.docRelease,
    window.docVersion,
    window.docProduct,
    window.docLanguage,
  ]);

  const [searchFilters, setSearchFilters] = useState<Filters>({
    ...defaultFilters,
  });

  const setFilters = (newFilters: Filters) => setSearchFilters(newFilters);

  return (
    <SearchHeaderLayoutContextProvider
      defaultFilters={defaultFilters}
      setFilters={setFilters}
    >
      <BrowserRouter>
        {/* <SearchBox
          searchFilters={searchFilters}
          isMobile={false} // todo move logic for isMobile
          placeholder={placeholder}
          searchTypeQueryParameterName="searchType"
        /> */}
        <SearchHeadWrapper
          isMobile={false}
          placeholder={placeholder}
          searchTypeQueryParameterName="searchType"
        />
      </BrowserRouter>
    </SearchHeaderLayoutContextProvider>
  );
}
