import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import { useAdminViewContext } from './AdminViewContext';
import ResultsPerPageSelect from './ResultsPerPageSelect';

export default function EntityListPagination() {
  const { resultsPerPage, filteredEntities, page, setPage } =
    useAdminViewContext();
  const [numberOfPages, setNumberOfPages] = useState(1);

  useEffect(() => {
    const numberOfPages =
      filteredEntities.length > resultsPerPage
        ? Math.ceil(filteredEntities.length / resultsPerPage)
        : 1;
    setNumberOfPages(numberOfPages);
  }, [filteredEntities, resultsPerPage]);

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ width: '100px' }} />
      <Pagination
        sx={{ alignSelf: 'center', margin: '16px 0' }}
        color="primary"
        count={numberOfPages}
        page={page}
        onChange={handleChangePage}
      />
      <ResultsPerPageSelect />
    </Box>
  );
}
