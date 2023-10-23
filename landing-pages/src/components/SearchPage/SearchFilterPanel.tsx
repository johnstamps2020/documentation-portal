import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import { mainHeight } from 'components/Layout/Layout';
import { useSearchData } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { ServerSearchFilter } from 'server/dist/types/serverSearch';
import ClearFilterButton from './ClearFiltersButton';
import FilterItemsSkeleton from './FilterItemsSkeleton';
import SearchFilter from './SearchFilter';
import SearchFilterGroup from './SearchFilterGroup';
import { StyledButton } from './StyledSearchComponents';

export type SearchFilterExpandStatus = {
  filterName: string;
  filterIsExpanded: boolean;
};

export type UIFilter = {
  name: ServerSearchFilter['name'] | 'release and version filter group';
  label: string;
  filters?: UIFilter[];
};

const uiFilters: UIFilter[] = [
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

function updateListOfFilterStatuses(filters: UIFilter[], value: boolean): SearchFilterExpandStatus[] {
  const filterStatusList: SearchFilterExpandStatus[] = [];

  filters.forEach(filter => {
    if (filter.filters) {
      const subFilterStatusList = updateListOfFilterStatuses(filter.filters, value);
      filterStatusList.push(...subFilterStatusList);
    }

    filterStatusList.push({
      filterName: filter.name,
      filterIsExpanded: value,
    });
  })
  return filterStatusList;
}

const expandCollapseAllFilters = (
  expand: boolean,
  setStatus: React.Dispatch<React.SetStateAction<SearchFilterExpandStatus[]>>
) => {
  const filterStatusList = updateListOfFilterStatuses(uiFilters, expand);
  setStatus(filterStatusList);
};

export default function SearchFilterPanel() {
  const { searchData, isLoading, isError } = useSearchData();
  const [allSearchFiltersExpandStatus, setAllSearchFiltersExpandStatus] =
    useState<SearchFilterExpandStatus[]>([]);

  useEffect(() => {
    expandCollapseAllFilters(true, setAllSearchFiltersExpandStatus);
  }, [searchData]);

  function getPanelStatus(filterName: string): boolean {
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
          onClick={() =>
            expandCollapseAllFilters(true, setAllSearchFiltersExpandStatus)
          }
          disabled={allSearchFiltersExpandStatus.every(
            (f) => f.filterIsExpanded
          )}
        >
          Expand all
        </StyledButton>
        <StyledButton
          onClick={() =>
            expandCollapseAllFilters(false, setAllSearchFiltersExpandStatus)
          }
          disabled={allSearchFiltersExpandStatus.every(
            (f) => !f.filterIsExpanded
          )}
        >
          Collapse all
        </StyledButton>
        <ClearFilterButton label="Clear filters" grouped={true} />
      </ButtonGroup>
      {uiFilters && !isLoading && searchData ? (
        uiFilters.map((uf) =>
          uf.filters ? (
            <SearchFilterGroup
              key={uf.name}
              label={uf.label}
              name={uf.name}
              expanded={getPanelStatus(uf.name)}
              onChange={handleChange}
              items={uf.filters}
              searchData={searchData}
              onExpandCollapse={getPanelStatus}
            />
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
