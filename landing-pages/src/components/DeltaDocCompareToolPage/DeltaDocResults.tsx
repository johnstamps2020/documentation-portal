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
import { useEffect } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocResultTableRow from './DeltaDocResultTableRow';
import Button from '@mui/material/Button';

export default function DeltaDocResults() {
  const {
    deltaDocData,
    releaseA,
    releaseB,
    resultsPerPage,
    setResultsPerPage,
    changePage,
    paginationData,
    page,
  } = useDeltaDocContext();

  useEffect(() => {
    changePage(1);
    setResultsPerPage(9);
  }, [deltaDocData]);

  if (!deltaDocData) {
    return <></>;
  }

  const { results } = deltaDocData;
  const count = Math.ceil(results.length / resultsPerPage);
  const higherRelease = releaseA > releaseB ? releaseA : releaseB;
  const lowerRelease = releaseA < releaseB ? releaseA : releaseB;
  const allResultsDisplayed = resultsPerPage === results.length;

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
          onChange={(event, page) => changePage(page)}
        />
        <Button
          onClick={() =>
            allResultsDisplayed
              ? setResultsPerPage(9)
              : (setResultsPerPage(results.length), changePage(1))
          }
          disabled={count === 1 && !allResultsDisplayed}
        >
          {allResultsDisplayed ? 'Show pagination' : 'Show all results'}
        </Button>
      </Box>
      <Typography variant="h1" textAlign="center">
        Found {results.length} {results.length === 1 ? 'page' : 'pages'} with
        differences
      </Typography>
      <TableContainer component={Paper} sx={{ mt: '30px', px: 2 }}>
        <Table
          sx={{ minWidth: 650, borderWidth: 0 }}
          aria-label="delta-doc-result-table"
        >
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
