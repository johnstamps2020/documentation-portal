import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { saveAs } from 'file-saver';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocHtmlReportGenerator() {
  const {
    releaseA,
    releaseB,
    url: deltaUrl,
    deltaDocData,
  } = useDeltaDocContext();

  if (!deltaDocData) {
    return <></>;
  }

  function exportReport() {
    const htmlContent = document.querySelector('table');
    const htmlTable = htmlContent ? htmlContent.outerHTML : '';
    const blob = new Blob([htmlTable], { type: 'text/html' });
    saveAs(blob, `${releaseA}-${releaseB}-${deltaUrl}-report.html`);
    // saveAs(blob, `${releaseA}-${releaseB}-${deltaUrl}-report.txt`);
  }
  return (
    <Tooltip title="If you want to save whole table, click 'Show all results'.">
      <Button onClick={() => exportReport()}>Download HTML report</Button>
    </Tooltip>
  );
}
