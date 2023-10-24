import { ServerSearchFilter } from 'server/dist/types/serverSearch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useSearchData } from 'hooks/useApi';
import AppliedFiltersSkeleton from './AppliedFiltersSkeleton';
import { useEffect, useState } from 'react';
import AppliedFilterControl from './AppliedFilterControl';

export default function AppliedFilters() {
  const { searchData, isLoading, isError } = useSearchData();
  const [checkedFilters, setCheckedFilters] = useState<ServerSearchFilter[]>();

  useEffect(() => {
    if (searchData) {
      const currentlyChecked = searchData.filters
        .map((f) => {
          const checkedValues = f.values.filter((v) => v.checked);
          if (checkedValues.length > 0) {
            return {
              ...f,
              values: checkedValues,
            };
          }
          return null;
        })
        .filter(Boolean)
        .filter((f) => f?.name !== 'platform') as ServerSearchFilter[];
        // FIXME: Temporary fix. We need to have a single source of truth
        // about the list of filters to display and use that single list 
        // in all places.
        //  - Create a context for expand/collapse status
        //  - Use the searchData hook in all filter components
        //  - pass down only the label etc. to the filter components

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
        {checkedFilters.map((f) =>
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
