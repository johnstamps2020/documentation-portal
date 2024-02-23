import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDeltaDocData } from 'hooks/useDeltaDocData';
import { compareDocs } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useEffect } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocPagination from './DeltaDocResults';
import { saveAs } from 'file-saver';
import { DeltaDocResultType } from '@doctools/server';

export default function DeltaDocResultsPanel() {
  const {
    releaseA,
    releaseB,
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

  useEffect(() => {
    setUnchangedFiles(undefined);
    setDocBaseFileChanges(undefined);
    setTotalFilesScanned(undefined);
    setDocBaseFilePercentageChanges(undefined);
    setReleaseALength(undefined);
    setReleaseBLength(undefined);
  }, [
    releaseA,
    releaseB,
    url,
    setUnchangedFiles,
    setDocBaseFileChanges,
    setTotalFilesScanned,
    setDocBaseFilePercentageChanges,
    setReleaseALength,
    setReleaseBLength,
  ]);

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

  const resultsPerPage = 9;
  const regexSearch = url.replace(/\d+/, '......');
  var outputRegex = new RegExp(regexSearch, 'g');
  const stringifiedData = JSON.stringify(deltaDocData).replaceAll(
    outputRegex,
    '/'
  );
  const parsedData: DeltaDocResultType[][] = JSON.parse(stringifiedData);
  const data = parsedData.map((releaseData) =>
    releaseData.filter((element) => {
      return element.id.replace(/[0-9]/g, '') !== url.replace(/[0-9]/g, '');
    })
  );

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
          <Button onClick={() => exportReport()}>Download report</Button>
          <DeltaDocPagination
            results={results}
            resultsPerPage={resultsPerPage}
          />
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
