import SearchFilter from './SearchFilter';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useCallback, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import ClearFilterButton from './ClearFiltersButton';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledButton,
} from './StyledSearchComponents';
import { useSearchData } from 'hooks/useApi';
import FilterItemsSkeleton from './FilterItemsSkeleton';
import { mainHeight } from 'components/Layout/Layout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NestedServerSearchFilter } from 'server/dist/types/serverSearch';

export type SearchFilterExpandStatus = {
  filterName: string;
  filterIsExpanded: boolean;
};

export default function SearchFilterPanel() {
  const { searchData, isLoading, isError } = useSearchData();
  const [allSearchFiltersExpandStatus, setAllSearchFiltersExpandStatus] =
    useState<SearchFilterExpandStatus[]>([]);

  const displayOrder = ['product', 'version', 'release', 'subject', 'language'];

  const simpleFilters = searchData?.filters.filter(
    (f) =>
      !['version', 'release'].includes(f.name) && displayOrder.includes(f.name)
  );

  const versionSearchFilter = searchData?.filters.find(
    (f) => f.name === 'version'
  );
  const releaseSearchFilter = searchData?.filters.find(
    (f) => f.name === 'release'
  );
  const nestedReleaseSearchFilter: NestedServerSearchFilter = {
    label: 'Release',
    searchFilters: [],
  };

  if (versionSearchFilter && releaseSearchFilter) {
    versionSearchFilter.label = 'Self-managed';
    releaseSearchFilter.label = 'Cloud';
    nestedReleaseSearchFilter.searchFilters.push(
      versionSearchFilter,
      releaseSearchFilter
    );
  }
  const nestedSearchFilters = [nestedReleaseSearchFilter];

  const toggleFilters = useCallback(
    (expand: boolean) => {
      if (searchData) {
        setAllSearchFiltersExpandStatus(
          searchData.filters.map((f) => ({
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
      (s) => s.filterName === filterName
    )?.filterIsExpanded;
    return filterStatus !== undefined ? filterStatus : true;
  }

  function handleChange(filterName: string, filterIsExpanded: boolean) {
    const updatedAllSearchFiltersExpandStatus =
      allSearchFiltersExpandStatus.map((s) => s);
    for (const filterExpandStatus of updatedAllSearchFiltersExpandStatus) {
      if (filterExpandStatus.filterName === filterName) {
        filterExpandStatus.filterIsExpanded = filterIsExpanded;
      }
    }
    setAllSearchFiltersExpandStatus(updatedAllSearchFiltersExpandStatus);
  }

  if (isError) {
    return null;
  }

  return (
    <Stack
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        height: mainHeight,
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
          disabled={allSearchFiltersExpandStatus.every(
            (f) => f.filterIsExpanded
          )}
        >
          Expand all
        </StyledButton>
        <StyledButton
          onClick={() => toggleFilters(false)}
          disabled={allSearchFiltersExpandStatus.every(
            (f) => !f.filterIsExpanded
          )}
        >
          Collapse all
        </StyledButton>
        <ClearFilterButton label="Clear filters" grouped={true} />
      </ButtonGroup>
      {nestedSearchFilters &&
        !isLoading &&
        nestedSearchFilters.map((nf) => (
          <StyledAccordion expanded={getPanelStatus(nf.label)} key={nf.label}>
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="search-filter-panel-content"
              id="search-filter-panel-header"
            >
              {nf.label} (
              {
                nf.searchFilters
                  .map((sf) => sf.values.filter((v) => v.checked))
                  .flat().length
              }
              /{nf.searchFilters.map((sf) => sf.values).flat().length})
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              {nf.searchFilters.map((f) => (
                <SearchFilter
                  key={`${nf.label}_${f.name}`}
                  serverSearchFilter={f}
                  expanded={getPanelStatus(f.name)}
                  onChange={handleChange}
                />
              ))}
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      {simpleFilters && !isLoading ? (
        simpleFilters.map((f) => (
          <SearchFilter
            key={f.name}
            serverSearchFilter={f}
            expanded={getPanelStatus(f.name)}
            onChange={handleChange}
          />
        ))
      ) : (
        <FilterItemsSkeleton />
      )}
    </Stack>
  );
}
