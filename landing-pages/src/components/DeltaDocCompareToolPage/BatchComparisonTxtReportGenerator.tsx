import Button from '@mui/material/Button';
import { DeltaDocData } from 'hooks/useDeltaDocData';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocLoading from './DeltaDocLoading';
import { createReport, exportReport } from './DeltaDocTxtReportGenerator';

export default function BatchComparisonTxtReportGenerator() {
  const {
    releaseA,
    releaseB,
    deltaDocBatchData,
    batchProduct,
    isBatchLoading,
  } = useDeltaDocContext();

  function handleReport(
    releaseA: string,
    releaseB: string,
    deltaDocBatchData: (DeltaDocData & {
      url: string;
      releaseA: string;
      releaseB: string;
    })[]
  ) {
    let cumulativeReport = '';
    deltaDocBatchData.forEach((deltaDocData) => {
      const {
        totalFilesScanned,
        unchangedFiles,
        releaseALength,
        releaseBLength,
        docBaseFileChanges,
        docBaseFilePercentageChanges,
        results,
        url,
      } = deltaDocData;

      const statValues = [
        totalFilesScanned,
        unchangedFiles,
        releaseALength,
        releaseBLength,
        docBaseFileChanges,
        docBaseFilePercentageChanges,
      ];

      const reportContent = createReport(
        url,
        releaseA,
        releaseB,
        statValues,
        results
      );
      cumulativeReport = cumulativeReport.concat(reportContent);
    });

    exportReport(cumulativeReport, releaseA, releaseB, batchProduct);
  }

  if (isBatchLoading) {
    return <DeltaDocLoading />;
  }

  if (!deltaDocBatchData || deltaDocBatchData.length === 0) {
    return <></>;
  }

  return (
    <Button
      size="large"
      variant="outlined"
      sx={{ width: '250px' }}
      onClick={() => handleReport(releaseA, releaseB, deltaDocBatchData)}
    >
      Download report in TXT
    </Button>
  );
}
