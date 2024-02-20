import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from 'react';

type DeltaDocPaginationType = {
  length: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  resultsPerPage: number;
};
export default function DeltaDocPagination({
  length,
  page,
  setPage,
  resultsPerPage,
}: DeltaDocPaginationType) {
  const [numberOfPages, setNumberOfPages] = useState(1);

  useEffect(() => {
    const numberOfPages =
      length > resultsPerPage ? Math.ceil(length / resultsPerPage) : 1;
    setNumberOfPages(numberOfPages);
  }, [length, resultsPerPage]);

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
    </Box>
  );
}
