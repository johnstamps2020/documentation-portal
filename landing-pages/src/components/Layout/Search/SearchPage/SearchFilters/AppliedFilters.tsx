import { ServerSearchFilter } from '@doctools/server';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useSearchData } from 'hooks/useApi';
import AppliedFiltersSkeleton from '../AppliedFiltersSkeleton';
import { useEffect, useState } from 'react';
import AppliedFilterControl from './AppliedFilterControl';
import { uiFilters } from './SearchFilterPanel';

// not all of these filters can be checked but including the full list
// in case the displayed filters changes
const filterOrder = [
  'release',
  'product',
  'version',
  'doc_title',
  'doc_display_title',
  'subject',
  'platform',
  'language',
];
const customSort = (a: ServerSearchFilter, b: ServerSearchFilter) => {
  const indexA = filterOrder.indexOf(a.name);
  const indexB = filterOrder.indexOf(b.name);
  return indexA - indexB;
};

export default function AppliedFilters() {
  const { searchData, isLoading, isError } = useSearchData();
  const [checkedFilters, setCheckedFilters] = useState<ServerSearchFilter[]>();

  useEffect(() => {
    if (searchData) {
      const currentlyChecked = searchData.filters
        .map((f) => {
          // This guarding clause checks if the filter is listed in uiFilters
          // or as one of the sub-filters of an existing uiFilter
          if (
            !uiFilters.some(
              (uiFilter) =>
                uiFilter.name === f.name ||
                uiFilter.filters?.some((subFilter) => subFilter.name === f.name)
            )
          ) {
            return null;
          }
          const checkedValues = f.values.filter((v) => v.checked);
          if (checkedValues.length > 0) {
            return {
              ...f,
              values: checkedValues,
            };
          }

          return null;
        })
        .filter(Boolean) as ServerSearchFilter[];

      if (currentlyChecked.length > 0) {
        setCheckedFilters(currentlyChecked);
      } else {
        setCheckedFilters([]);
      }
    }
  }, [searchData, searchData?.filters]);

  if (!searchData || isLoading) {
    return <AppliedFiltersSkeleton />;
  }

  if (isError || !checkedFilters || checkedFilters.length === 0) {
    return null;
  }

  const ListItem = styled('li')(() => ({
    margin: '0 4px 6px 0',
  }));

  const sortedFilters = checkedFilters.sort(customSort);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} gap={2}>
      <Typography sx={{ padding: 0, minWidth: '110px' }}>
        Applied filters:
      </Typography>
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 0,
          m: 0,
        }}
        component="ul"
        elevation={0}
      >
        {sortedFilters.map((f) =>
          f.values.map((v) => (
            <ListItem key={v.label}>
              <AppliedFilterControl name={f.name} value={v.label} />
            </ListItem>
          ))
        )}
      </Paper>
    </Stack>
  );
}
