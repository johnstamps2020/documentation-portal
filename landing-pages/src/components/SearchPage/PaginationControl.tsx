import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearch } from '../../context/SearchContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaginationControlled() {
  const { searchData } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1');

  function handleChange(event: React.ChangeEvent<unknown>, value: number) {
    query.set('page', value.toString());
    navigate({
      pathname: location.pathname,
      search: `?${query.toString()}`,
    });
  }

  if (!searchData) {
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
