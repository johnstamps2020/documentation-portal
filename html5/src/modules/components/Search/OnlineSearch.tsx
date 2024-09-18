import React, { useMemo, useState } from 'react';
import { translate } from '@doctools/core';
import { BrowserRouter } from 'react-router-dom';
import {
  SearchHeaderLayoutContextProvider,
  SearchHeadWrapper,
  Filters,
} from '@doctools/core';

export default function OnlineSearch() {
  const docId = document
    .querySelector('[name="gw-doc-id"]')
    ?.getAttribute('content');
  const placeholder = translate({
    id: 'gwSearchForm.placeholder',
    message: 'Search',
  });
  const defaultFilters = useMemo(() => {
    const df: Filters = {};
    // TODO: see if there is sessionStorage of latestLandingPageReleases and use that
    // if (window.docPlatform) {
    //   df.platform = [window.docPlatform];
    // }
    if (window.docPlatform.includes('Cloud') && window.docRelease) {
      df.release = window.docRelease.split(',');
    }
    if (window.docPlatform.includes('Self-managed') && window.docVersion) {
      df.version = window.docVersion.split(',');
    }
    if (window.docProduct) {
      df.product = window.docProduct.split(',');
    }
    if (window.docLanguage) {
      df.language = window.docLanguage.split(',');
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
        <SearchHeadWrapper
          isMobile={false}
          placeholder={placeholder}
          docTitle={window.docTitle}
        />
      </BrowserRouter>
    </SearchHeaderLayoutContextProvider>
  );
}
