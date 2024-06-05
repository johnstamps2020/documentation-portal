import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BatchComparisonTxtReportGenerator from './BatchComparisonTxtReportGenerator';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocLoading from './DeltaDocLoading';

export default function BatchComparisonResultsPanel() {
  const {
    deltaDocBatchData,
    deltaDocData,
    isBatchError,
    releaseA,
    releaseB,
    numberOfDocsInProduct,
  } = useDeltaDocContext();

  if (
    (!deltaDocBatchData ||
      deltaDocBatchData.length !== numberOfDocsInProduct) &&
    releaseA &&
    releaseB &&
    !deltaDocData
  ) {
    return <DeltaDocLoading />;
  }

  if (!deltaDocBatchData || deltaDocBatchData.length === 0 || isBatchError) {
    return <></>;
  }

  return (
    <Stack alignItems="center">
      <Typography textAlign="center" variant="h3" sx={{ my: '16px' }}>
        Your results are ready. Click below to download a report.
      </Typography>
      <BatchComparisonTxtReportGenerator />
    </Stack>
  );
}
