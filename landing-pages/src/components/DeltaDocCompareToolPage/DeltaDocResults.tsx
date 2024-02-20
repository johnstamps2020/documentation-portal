import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDeltaDocData } from 'hooks/useDeltaDocData';
import { compareDocs } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useEffect } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocPagination from './DeltaDocPagination';
import { saveAs } from 'file-saver';
import Link from '@mui/material/Link';

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

  const { deltaDocData, isLoading, isError } = useDeltaDocData({
    releaseA,
    releaseB,
    url,
  });

  useEffect(
    () => (
      setPage(1),
      setUnchangedFiles(undefined),
      setDocBaseFileChanges(undefined),
      setTotalFilesScanned(undefined),
      setDocBaseFilePercentageChanges(undefined),
      setReleaseALength(undefined),
      setReleaseBLength(undefined)
    ),
    [releaseA, releaseB, url, setPage]
  );
  if (!deltaDocData && !url) {
    return <></>;
  }

  if (!deltaDocData || isError || isLoading) {
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

  const regexSearch = url.replace(/\d+/, '......');
  var outputRegex = new RegExp(regexSearch, 'g');
  const stringifiedData = JSON.stringify(deltaDocData).replaceAll(
    outputRegex,
    '/'
  );
  const data = JSON.parse(stringifiedData);
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

  if (results.length > 0) {
    setUnchangedFiles(identicalEntires);
    setDocBaseFileChanges(docBaseFileChanges);
    setTotalFilesScanned(totalFilesScanned);
    setDocBaseFilePercentageChanges(docBaseFilePercentageChanges);
    setReleaseALength(releaseALength);
    setReleaseBLength(releaseBLength);
  }

  const resultsPerPage = 9;
  const resultsOffset = page === 1 ? 0 : (page - 1) * resultsPerPage;

  function exportReport() {
    const reportText = `Comparing ${url} in ${releaseA} and ${releaseB}\nFiles scanned: ${totalFilesScanned}\n`;
    const resultsWithNames = JSON.stringify(results, null, 2)
      .replaceAll('"docATitle":', `"${releaseA}Title":`)
      .replaceAll('"docBTitle":', `"${releaseB}Title":`);
    const report = reportText + resultsWithNames;
    var blob = new Blob([report], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${releaseA}-${releaseB}-${url}-report.txt`);
  }

  return !areReleasesIdentical && results.length !== 0 ? (
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
          <Button onClick={() => exportReport()}>Download report</Button>
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
                  <Link
                    sx={{
                      wordWrap: 'break-word',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                    href={url.slice(0, -1) + result.URL}
                    target="_blank"
                  >
                    {url.slice(0, -1) + result.URL}
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
