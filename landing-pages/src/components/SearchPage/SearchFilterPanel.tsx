import SearchFilter from './SearchFilter';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useCallback, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import ClearFilterButton from './ClearFiltersButton';
import { StyledButton } from './StyledSearchComponents';
import { useSearchData } from '../../hooks/useApi';

export type SearchFilterExpandStatus = {
  filterName: string;
  filterIsExpanded: boolean;
};

export default function SearchFilterPanel() {
  const { searchData } = useSearchData();
  const [
    allSearchFiltersExpandStatus,
    setAllSearchFiltersExpandStatus,
  ] = useState<SearchFilterExpandStatus[]>([]);

  const toggleFilters = useCallback(
    (expand: boolean) => {
      if (searchData) {
        setAllSearchFiltersExpandStatus(
          searchData.filters.map(f => ({
            filterName: f.name,
            filterIsExpanded: expand,
          }))
        );
      }
    },
    [searchData]
  );

  useEffect(() => {
    toggleFilters(true);
  }, [searchData, toggleFilters]);

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

  return (
    <Stack
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        height: '100vh',
        overflow: 'scroll',
        scrollbarWidth: 'thin',
        padding: { xs: '8px 8px', sm: '16px 16px' },
      }}
    >
      <ButtonGroup
        size="small"
        variant="text"
        aria-label="text small button group"
        sx={{
          justifyContent: 'space-between',
          gap: '6px',
          width: '100%',
          marginBottom: '8px',
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
      {searchData?.filters.map(f => (
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
