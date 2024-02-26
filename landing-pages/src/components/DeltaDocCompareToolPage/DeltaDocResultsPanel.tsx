import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocReportGenerator from './DeltaDocReportGenerator';
import DeltaDocResults from './DeltaDocResults';

export default function DeltaDocResultsPanel() {
  const { releaseA, releaseB, url, deltaDocData, isError, isLoading } =
    useDeltaDocContext();

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
  const { areReleasesIdentical, results, releaseALength, releaseBLength } =
    deltaDocData;

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
          <DeltaDocReportGenerator results={results} />
          <DeltaDocResults results={results} resultsPerPage={resultsPerPage} />
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
