import { DeltaLevenshteinReturnType } from '@doctools/server';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import usePagination from '../../hooks/usePagination';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import DeltaDocResultCard from './DeltaDocResultCard';

type DeltaDocResultsType = {
  results: DeltaLevenshteinReturnType[];
  resultsPerPage: number;
};

export default function DeltaDocResults({
  results,
  resultsPerPage,
}: DeltaDocResultsType) {
  const [page, setPage] = useState(1);

  const count = Math.ceil(results.length / resultsPerPage);
  const paginationData = usePagination({
    data: results,
    itemsPerPage: resultsPerPage,
  });

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
