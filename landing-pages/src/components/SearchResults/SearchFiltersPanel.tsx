import SearchFilter from "./SearchFilter";
import { useSearch } from "../../context/SearchContext";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ClearFilterButton from "./ClearFiltersButton";

export type SearchFilterExpandStatus = {
  filterName: string;
  filterIsExpanded: boolean;
};

export default function SearchFiltersPanel() {
  const { searchData } = useSearch();
  const [
    allSearchFiltersExpandStatus,
    setAllSearchFiltersExpandStatus
  ] = useState<SearchFilterExpandStatus[]>([]);

  useEffect(() => {
    toggleFilters(true);
  }, [searchData]);

  function getPanelStatus(filterName: string) {
    const filterStatus = allSearchFiltersExpandStatus.find(
      s => s.filterName === filterName
    )?.filterIsExpanded;
    return filterStatus !== undefined ? filterStatus : true;
  }

  function handleChange(filterName: string, filterIsExpanded: boolean) {
    const updatedAllSearchFiltersExpandStatus = allSearchFiltersExpandStatus.map(
      s => s
    );
    for (const filterExpandStatus of updatedAllSearchFiltersExpandStatus) {
      if (filterExpandStatus.filterName === filterName) {
        filterExpandStatus.filterIsExpanded = filterIsExpanded;
      }
    }
    setAllSearchFiltersExpandStatus(updatedAllSearchFiltersExpandStatus);
  }

  function toggleFilters(expand: boolean) {
    if (searchData) {
      setAllSearchFiltersExpandStatus(
        searchData.filters.map(f => ({
          filterName: f.name,
          filterIsExpanded: expand
        }))
      );
    }
  }

  if (!searchData) {
    return null;
  }

  return (
    <Stack
      sx={{
        minWidth: "300px",
        maxWidth: "300px",
        height: "100vh",
        overflow: "scroll",
        scrollbarWidth: "thin",
        padding: "16px 16px"
      }}
    >
      <ButtonGroup
        size="small"
        variant="text"
        aria-label="text small button group"
      >
        <Button
          onClick={() => toggleFilters(true)}
          disabled={allSearchFiltersExpandStatus.every(f => f.filterIsExpanded)}
        >
          Expand all
        </Button>
        <Button
          onClick={() => toggleFilters(false)}
          disabled={allSearchFiltersExpandStatus.every(
            f => !f.filterIsExpanded
          )}
        >
          Collapse all
        </Button>
        <ClearFilterButton label="Clear filters" grouped={true} />
      </ButtonGroup>
      {searchData.filters.map(f => (
        <SearchFilter
          key={f.name}
          serverSearchFilter={f}
          expanded={getPanelStatus(f.name)}
          onChange={handleChange}
        />
      ))}
    </Stack>
  );
}
