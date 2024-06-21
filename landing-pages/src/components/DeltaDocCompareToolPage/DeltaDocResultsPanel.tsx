import Typography from '@mui/material/Typography';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocTxtReportGenerator from './DeltaDocTxtReportGenerator';
import DeltaDocHtmlReportGenerator from './DeltaDocHtmlReportGenerator';
import DeltaDocResults from './DeltaDocResults';
import Alert from '@mui/material/Alert';
import BatchComparisonResultsPanel from './BatchComparisonResultsPanel';
import DeltaDocLoading from './DeltaDocLoading';

export default function DeltaDocResultsPanel() {
  const {
    releaseA,
    releaseB,
    firstDocId,
    secondDocId,
    firstDoc,
    deltaDocData,
    isError,
    isLoading,
    batchComparison,
  } = useDeltaDocContext();

  if (batchComparison) {
    return <BatchComparisonResultsPanel />;
  }

  if ((!deltaDocData && !firstDocId && !secondDocId) || isError) {
    return <></>;
  }

  if (!deltaDocData || isLoading) {
    return <DeltaDocLoading />;
  }

  const { areReleasesIdentical, results, releaseALength, releaseBLength } =
    deltaDocData;

  return !areReleasesIdentical && results.length !== 0 ? (
    <>
      {(releaseALength === 0 || releaseBLength === 0) && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{ m: 'auto', width: 'fit-content' }}
        >
          Didn't find any topics in {releaseALength === 0 ? releaseA : releaseB}
          .
        </Alert>
      )}
      {results.some((result) => result.changes === 0) && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{ m: 'auto', width: 'fit-content' }}
        >
          This doc belongs to many releases. Results may not be accurate.
        </Alert>
      )}
      <DeltaDocTxtReportGenerator />
      <DeltaDocHtmlReportGenerator />
      <DeltaDocResults />
    </>
  ) : (
    <Typography variant="h2" textAlign="center">
      {areReleasesIdentical
        ? ` Releases ${releaseA.join(', ')} and ${releaseB.join(', ')} are
        identical.`
        : `No differences found for ${firstDoc?.title} in ${releaseA} and ${releaseB}.`}
    </Typography>
  );
}
