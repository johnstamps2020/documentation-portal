import { useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useEffect, useState } from "react";

export default function useClearFilters() {
  const { searchData } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [noFiltersApplied, setNoFiltersApplied] = useState(true);

  useEffect(() => {
    setNoFiltersApplied(
      !!searchData?.filters.every(f => f.values.every(v => !v.checked))
    );
  }, [searchData]);

  function clearFilters() {
    if (!searchData) {
      return null;
    }
    const filters = searchData.filters.map(f => f.name);
    for (const filter of filters) {
      if (query.has(filter)) {
        query.delete(filter);
      }
    }
    query.delete("page");
    navigate({
      pathname: `${location.pathname}`,
      search: query && `?${query.toString()}`
    });
  }

  return {
    clearFilters,
    noFiltersApplied
  };
}
