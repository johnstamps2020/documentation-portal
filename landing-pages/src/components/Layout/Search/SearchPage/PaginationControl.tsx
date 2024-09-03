import { navigateWithUpdatedParams } from '@doctools/components';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchData } from 'hooks/useApi';
import * as React from 'react';

export default function PaginationControl() {
  const { searchData } = useSearchData();
  const query = new URLSearchParams(window.location.search);
  const page = parseInt(query.get('page') || '1');

  function handleChange(event: React.ChangeEvent<unknown>, value: number) {
    query.set('page', value.toString());
    navigateWithUpdatedParams(query);
  }

  if (!searchData || searchData.pages <= 1) {
    return null;
  }
  return (
    <Stack spacing={2} alignItems="center" sx={{ margin: '24px 0 0 0' }}>
      <Pagination
        showFirstButton
        showLastButton
        color="primary"
        count={searchData.pages}
        siblingCount={1}
        boundaryCount={1}
        page={page}
        onChange={handleChange}
      />
    </Stack>
  );
}
