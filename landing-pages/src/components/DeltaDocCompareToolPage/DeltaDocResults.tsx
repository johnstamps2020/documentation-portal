import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import usePagination from '../../hooks/usePagination';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocResultTableRow from './DeltaDocResultTableRow';

export default function DeltaDocResults() {
  const [page, setPage] = useState(1);
  const resultsPerPage = 9;
  const { deltaDocData, releaseA, releaseB } = useDeltaDocContext();
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

  const higherRelease = releaseA > releaseB ? releaseA : releaseB;
  const lowerRelease = releaseA < releaseB ? releaseA : releaseB;
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
        Found {results.length} pages with differences
      </Typography>
      <TableContainer component={Paper} sx={{ mt: '30px', px: 2 }}>
        <Table sx={{ minWidth: 650, borderWidth: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Change</TableCell>
              <TableCell align="center">URL in {lowerRelease}</TableCell>
              <TableCell align="center">URL in {higherRelease}</TableCell>
              <TableCell align="center">Title in {lowerRelease}</TableCell>
              <TableCell align="center">Title in {higherRelease}</TableCell>
              <TableCell align="center">Number of changes</TableCell>
              <TableCell align="center">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginationData.currentData().map((result, index) => (
              <DeltaDocResultTableRow
                result={result}
                index={index + (page - 1) * resultsPerPage + 1}
                releases={{ lowerRelease, higherRelease }}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
