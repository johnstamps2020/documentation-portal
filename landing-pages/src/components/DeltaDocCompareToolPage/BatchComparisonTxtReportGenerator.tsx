import { DeltaDocInputType, Doc } from '@doctools/server';
import Button from '@mui/material/Button';
import { DeltaDocData, useDocsByProduct } from 'hooks/useDeltaDocData';
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
  const {
    docs,
    isLoading: isLoadingDocs,
    isError: isErrorDocs,
  } = useDocsByProduct(batchProduct);

  function handleReport(
    releaseA: string[],
    releaseB: string[],
    deltaDocBatchData: (DeltaDocData & DeltaDocInputType)[],
    docs: Doc[]
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
        firstDocId,
      } = deltaDocData;

      const firstDocIdentifier =
        docs.find((doc) => doc.id === firstDocId)?.title || firstDocId;

      const statValues = [
        totalFilesScanned,
        unchangedFiles,
        releaseALength,
        releaseBLength,
        docBaseFileChanges,
        docBaseFilePercentageChanges,
      ];

      const reportContent = createReport(
        firstDocIdentifier,
        releaseA,
        releaseB,
        statValues,
        results
      );
      cumulativeReport = cumulativeReport.concat(reportContent);
    });

    exportReport(cumulativeReport, releaseA, releaseB, batchProduct);
  }

  if (isBatchLoading || isLoadingDocs) {
    return <DeltaDocLoading />;
  }

  if (
    !deltaDocBatchData ||
    deltaDocBatchData.length === 0 ||
    !docs ||
    isErrorDocs
  ) {
    return <></>;
  }

  return (
    <Button
      size="large"
      variant="outlined"
      sx={{ width: '250px' }}
      onClick={() => handleReport(releaseA, releaseB, deltaDocBatchData, docs)}
    >
      Download report in TXT
    </Button>
  );
}
