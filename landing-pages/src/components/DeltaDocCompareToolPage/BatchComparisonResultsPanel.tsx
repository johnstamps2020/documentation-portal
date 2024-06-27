import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import BatchComparisonTxtReportGenerator from './BatchComparisonTxtReportGenerator';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocLoading from './DeltaDocLoading';

export default function BatchComparisonResultsPanel() {
  const {
    deltaDocBatchData,
    deltaDocData,
    isBatchError,
    isBatchLoading,
    releaseA,
    releaseB,
    batchProduct,
    batchComparison,
    setBatchFormState,
  } = useDeltaDocContext();

  useEffect(() => {
    setBatchFormState([]);
  }, [batchComparison]);

  if (
    isBatchLoading &&
    releaseA.length !== 0 &&
    releaseB.length !== 0 &&
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
        Your results for {batchProduct} in {releaseA} and {releaseB} are ready.
        Click below to download a report.
      </Typography>
      <BatchComparisonTxtReportGenerator />
    </Stack>
  );
}
