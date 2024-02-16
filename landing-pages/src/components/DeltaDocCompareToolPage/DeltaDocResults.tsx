import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDeltaDocData } from 'hooks/useDeltaDocData';
import { compareDocs } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useEffect } from 'react';
import { useDeltaDocContext } from './DeltaDocLayoutContext';
import DeltaDocPagination from './DeltaDocPagination';

export default function DeltaDocResults() {
  const {
    releaseA,
    releaseB,
    page,
    setPage,
    url,
    setUnchangedFiles,
    setDocBaseFileChanges,
    setDocBaseFilePercentageChanges,
    setTotalFilesScanned,
    setReleaseALength,
    setReleaseBLength,
  } = useDeltaDocContext();
  const {
    deltaDocData: data,
    isLoading,
    isError,
  } = useDeltaDocData({
    releaseA,
    releaseB,
    url,
  });

  useEffect(() => setPage(1), [releaseA, releaseB, url]);
  if (!data && !url) {
    return <></>;
  }

  if (!data || isError || isLoading) {
    return (
      <Container
        sx={{
          padding: '3rem 0',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const {
    results,
    areReleasesIdentical,
    unchangedFiles: identicalEntires,
    totalFilesScanned,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
    releaseALength,
    releaseBLength,
  } = compareDocs(data);

  setUnchangedFiles(identicalEntires);
  setDocBaseFileChanges(docBaseFileChanges);
  setTotalFilesScanned(totalFilesScanned);
  setDocBaseFilePercentageChanges(docBaseFilePercentageChanges);
  setReleaseALength(releaseALength);
  setReleaseBLength(releaseBLength);

  const resultsPerPage = 9;
  const resultsOffset = page === 1 ? 0 : (page - 1) * resultsPerPage;

  return !areReleasesIdentical ? (
    <>
      {releaseALength === 0 || releaseBLength === 0 ? (
        <>
          <Typography variant="h2" textAlign="center">
            This document is not available in one of the releases. Try different
            release.
          </Typography>
        </>
      ) : (
        <>
          <DeltaDocPagination
            length={results.length}
            page={page}
            setPage={setPage}
            resultsPerPage={resultsPerPage}
          />
          <Typography variant="h1" textAlign="center">
            Found {results.length} docs with differences
          </Typography>
          <Stack direction="row" flexWrap="wrap">
            {results
              .slice(resultsOffset, resultsOffset + resultsPerPage)
              .map((result, key) => (
                <Paper
                  sx={{
                    minHeight: '50px',
                    width: '340px',
                    p: 3,
                    margin: '10px 20px',
                  }}
                  key={key}
                >
                  <Typography variant="h3" sx={{ wordWrap: 'break-word' }}>
                    {result.URL}
                  </Typography>{' '}
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
                  <Typography sx={{ color: 'red' }}>
                    Percentage: {result.percentage}%
                  </Typography>
                </Paper>
              ))}{' '}
          </Stack>
        </>
      )}
    </>
  ) : (
    <>
      <Typography variant="h2" textAlign="center">
        The releases {releaseA} and {releaseB} are identical.{' '}
      </Typography>
    </>
  );
}
