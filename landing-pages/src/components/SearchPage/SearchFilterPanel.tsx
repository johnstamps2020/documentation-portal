import SearchFilter from './SearchFilter';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useCallback, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import ClearFilterButton from './ClearFiltersButton';
import { StyledButton } from './StyledSearchComponents';
import { useSearchData } from 'hooks/useApi';
import FilterItemsSkeleton from './FilterItemsSkeleton';
import { mainHeight } from 'components/Layout/Layout';
import SearchFilterGroup from './SearchFilterGroup';

export type SearchFilterExpandStatus = {
  filterName: string;
  filterIsExpanded: boolean;
};

export type UIFilter = {
  name: string;
  label: string;
  filters?: UIFilter[];
};

export default function SearchFilterPanel() {
  const { searchData, isLoading, isError } = useSearchData();
  const [allSearchFiltersExpandStatus, setAllSearchFiltersExpandStatus] =
    useState<SearchFilterExpandStatus[]>([]);

  const UIFilters: UIFilter[] = [
    { name: 'product', label: 'Product' },
    {
      name: 'release and version filter group',
      label: 'Release',
      filters: [
        { name: 'release', label: 'Cloud' },
        { name: 'version', label: 'Self-managed' },
      ],
    },
    { name: 'subject', label: 'Subject' },
    { name: 'language', label: 'Language' },
  ];

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
      {UIFilters && !isLoading && searchData ? (
        UIFilters.map((uf) =>
          uf.filters ? (
            <SearchFilterGroup
              key={uf.name}
              label={uf.label}
              name={uf.name}
              expanded={getPanelStatus(uf.name)}
              onChange={handleChange}
            >
              {uf.filters.map((gf) => (
                <SearchFilter
                  key={gf.name}
                  label={gf.label}
                  // @ts-ignore
                  serverSearchFilter={searchData.filters.find(
                    (sf) => sf.name === gf.name
                  )}
                  expanded={getPanelStatus(gf.name)}
                  onChange={handleChange}
                />
              ))}
            </SearchFilterGroup>
          ) : (
            <SearchFilter
              key={uf.name}
              label={uf.label}
              // @ts-ignore
              serverSearchFilter={searchData.filters.find(
                (f) => f.name === uf.name
              )}
              expanded={getPanelStatus(uf.name)}
              onChange={handleChange}
            />
          )
        )
      ) : (
        <FilterItemsSkeleton />
      )}
    </Stack>
  );
}
