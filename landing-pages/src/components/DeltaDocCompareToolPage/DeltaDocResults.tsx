import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import usePagination from '../../hooks/usePagination';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocResultCard from './DeltaDocResultCard';

export default function DeltaDocResults() {
  const [page, setPage] = useState(1);
  const resultsPerPage = 9;
  const { deltaDocData } = useDeltaDocContext();
  const paginationData = usePagination({
    data: deltaDocData?.results || [],
    itemsPerPage: resultsPerPage,
  });

  if (!deltaDocData) {
    return <></>;
  }

  const { results } = deltaDocData;
  const count = Math.ceil(results.length / resultsPerPage);

  function handleChange(page: number) {
    setPage(page);
    paginationData.jump(page);
  }

  return (
    <>
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
          count={count}
          page={page}
          onChange={(event, page) => handleChange(page)}
        />
      </Box>
      <Typography variant="h1" textAlign="center">
        Found {results.length} docs with differences
      </Typography>
      <Stack direction="row" flexWrap="wrap">
        {paginationData.currentData().map((result, key) => (
          <DeltaDocResultCard result={result} key={key} />
        ))}
      </Stack>
    </>
  );
}
