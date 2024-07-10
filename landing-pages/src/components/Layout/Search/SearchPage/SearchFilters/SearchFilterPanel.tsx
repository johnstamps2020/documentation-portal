import Stack from '@mui/material/Stack';
import { mainHeight } from 'components/Layout/Layout';
import { useSearchData } from 'hooks/useApi';
import { ServerSearchFilter } from '@doctools/server';
import FilterItemsSkeleton from '../FilterItemsSkeleton';
import { ExpandCollapseProvider } from './ExpandCollapseContext';
import SearchFilter from './SearchFilter';
import SearchFilterGroup from './SearchFilterGroup';
import SearchFilterPanelButtons from './SearchFilterPanelButtons';

export type SearchFilterExpandStatus = {
  filterName: string;
  filterIsExpanded: boolean;
};

type UIFilterName =
  | ServerSearchFilter['name']
  | 'release and version filter group';

export type UIFilter = {
  name: UIFilterName;
  label: string;
  filters?: UIFilter[];
};

export const uiFilters: UIFilter[] = [
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

export default function SearchFilterPanel() {
  const { searchData, isLoading, isError } = useSearchData();

  if (isError) {
    return null;
  }

  return (
    <ExpandCollapseProvider>
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
        <SearchFilterPanelButtons />
        {uiFilters && !isLoading && searchData ? (
          uiFilters.map((uiFilter) => {
            const subFilters = uiFilter.filters;
            if (subFilters) {
              return (
                <SearchFilterGroup
                  key={uiFilter.name}
                  label={uiFilter.label}
                  name={uiFilter.name}
                  filters={subFilters}
                />
              );
            }

            return (
              <SearchFilter
                key={uiFilter.name}
                label={uiFilter.label}
                name={uiFilter.name}
              />
            );
          })
        ) : (
          <FilterItemsSkeleton />
        )}
      </Stack>
    </ExpandCollapseProvider>
  );
}
