import SearchFilter from "./SearchFilter";
import { useSearch } from "../../context/SearchContext";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ClearFilterButton from "./ClearFiltersButton";
import { StyledButton } from "./StyledSearchComponents";

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
        sx={{
          justifyContent: "space-between",
          gap: "6px",
          width: "100%",
          marginBottom: "8px"
        }}
      >
        <StyledButton
          onClick={() => toggleFilters(true)}
          disabled={allSearchFiltersExpandStatus.every(f => f.filterIsExpanded)}
        >
          Expand all
        </StyledButton>
        <StyledButton
          onClick={() => toggleFilters(false)}
          disabled={allSearchFiltersExpandStatus.every(
            f => !f.filterIsExpanded
          )}
        >
          Collapse all
        </StyledButton>
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
