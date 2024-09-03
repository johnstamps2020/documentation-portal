import { navigateWithUpdatedParams } from '@doctools/components';
import { useEffect, useState } from 'react';
import { useSearchData } from './useApi';

export default function useClearFilters() {
  const { searchData } = useSearchData();
  const query = new URLSearchParams(window.location.search);
  const [noFiltersApplied, setNoFiltersApplied] = useState(true);

  useEffect(() => {
    setNoFiltersApplied(
      !!searchData?.filters.every((f) => f.values.every((v) => !v.checked))
    );
  }, [searchData]);

  function clearFilters() {
    if (!searchData) {
      return null;
    }
    const filters = searchData.filters.map((f) => f.name);
    for (const filter of filters) {
      if (query.has(filter)) {
        query.delete(filter);
      }
    }
    query.delete('page');
    navigateWithUpdatedParams(query);
  }

  return {
    clearFilters,
    noFiltersApplied,
  };
}
