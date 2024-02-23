import { DeltaLevenshteinReturnType } from '@doctools/server';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import usePagination from '../../hooks/usePagination';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import Link from '@mui/material/Link';
import { useDeltaDocContext } from './DeltaDocContext';

type DeltaDocResultsType = {
  results: DeltaLevenshteinReturnType[];
  resultsPerPage: number;
};

export default function DeltaDocResults({
  results,
  resultsPerPage,
}: DeltaDocResultsType) {
  const [page, setPage] = useState(1);
  const { releaseA, releaseB, url } = useDeltaDocContext();

  const count = Math.ceil(results.length / resultsPerPage);
  const paginationData = usePagination({
    data: results,
    itemsPerPage: resultsPerPage,
  });

  function handleChange(page: number) {
    setPage(page);
    paginationData.jump(page);
  }
  function getInfo(text: string, colorInfo: string) {
    return <Typography sx={{ color: colorInfo }}>{text}</Typography>;
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
          <Paper
            sx={{
              minHeight: '50px',
              width: '340px',
              p: 3,
              margin: '10px 20px',
            }}
            key={key}
          >
            <Link
              sx={{
                wordWrap: 'break-word',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
              href={
                result.URL.includes('cloud')
                  ? result.URL
                  : url.slice(0, -1) + result.URL
              }
              target="_blank"
            >
              {result.URL.includes('cloud')
                ? result.URL
                : url.slice(0, -1) + result.URL}
            </Link>{' '}
            {result.docATitle === result.docBTitle ? (
              <>
                <Typography>
                  Title in both releases: {result.docATitle}
                </Typography>{' '}
              </>
            ) : (
              <>
                <Typography>
                  Title in {releaseA}: {result.docATitle}
                </Typography>{' '}
                <Typography>
                  Title in {releaseB}: {result.docBTitle}
                </Typography>
              </>
            )}
            <Typography sx={{ color: 'red' }}>
              Number of changes: {result.changes}
            </Typography>
            {result.percentage >= 100 &&
            (result.docATitle === fileDoesNotExistText ||
              result.docBTitle === fileDoesNotExistText) ? (
              <>
                {releaseA > releaseB
                  ? result.docATitle === fileDoesNotExistText
                    ? getInfo(`Deleted in ${releaseA}`, 'red')
                    : getInfo(`Added in ${releaseA}`, 'green')
                  : result.docBTitle === fileDoesNotExistText
                  ? getInfo(`Deleted in ${releaseB}`, 'red')
                  : getInfo(`Added in ${releaseB}`, 'green')}
              </>
            ) : (
              <Typography sx={{ color: 'red' }}>
                Percentage: {result.percentage}%
              </Typography>
            )}
          </Paper>
        ))}{' '}
      </Stack>
    </>
  );
}
