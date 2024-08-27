import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocResultPagination from './DeltaDocResultPagination';
import DeltaDocResultTableRow from './DeltaDocResultTableRow';

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

  if (!deltaDocData) {
    return <></>;
  }

  const { results } = deltaDocData;
  const count = Math.ceil(results.length / resultsPerPage);
  const allResultsDisplayed = resultsPerPage === results.length;

  const sortedReleasesA = releaseA.sort((a, b) => b.localeCompare(a));
  const sortedReleasesB = releaseB.sort((a, b) => b.localeCompare(a));
  const releases =
    sortedReleasesA[0] > sortedReleasesB[0]
      ? {
          higherRelease: { releases: sortedReleasesA[0], source: 'A' },
          lowerRelease: { releases: sortedReleasesB[0], source: 'B' },
        }
      : {
          higherRelease: { releases: sortedReleasesB[0], source: 'B' },
          lowerRelease: { releases: sortedReleasesA[0], source: 'A' },
        };

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
        <DeltaDocResultPagination count={count} />
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
      <TableContainer component={Paper} sx={{ mt: '30px', mb: '50px', px: 2 }}>
        <Table
          sx={{ minWidth: 650, borderWidth: 0 }}
          aria-label="delta-doc-result-table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Change</TableCell>
              <TableCell align="center">
                URL in {releases.lowerRelease.releases}
              </TableCell>
              <TableCell align="center">
                URL in {releases.higherRelease.releases}
              </TableCell>
              <TableCell align="center">
                Title in {releases.lowerRelease.releases}
              </TableCell>
              <TableCell align="center">
                Title in {releases.higherRelease.releases}
              </TableCell>
              <TableCell align="center">Number of changes</TableCell>
              <TableCell align="center">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginationData.currentData().map((result, index) => (
              <DeltaDocResultTableRow
                result={result}
                index={index + (page - 1) * resultsPerPage + 1}
                releases={releases}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
