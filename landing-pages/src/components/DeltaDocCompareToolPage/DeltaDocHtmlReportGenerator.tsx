import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { saveAs } from 'file-saver';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocHtmlReportGenerator() {
  const {
    releaseA,
    releaseB,
    url,
    deltaDocData,
    setResultsPerPage,
    handleChange,
  } = useDeltaDocContext();

  if (!deltaDocData) {
    return <></>;
  }

  function exportReport() {
    const htmlContent = document.querySelector('table');
    const htmlTable = htmlContent
      ? `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${releaseA} ${releaseB} ${url} Table</title>
      <style>
        /* Add CSS styles here */
        table {
          border-collapse: collapse;
          width: 100%;
          border: 1px solid #dddddd; /* Add border to table */
        }
        th, td {
          border: 1px solid #dddddd; /* Add border to cells */
          text-align: left;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
        }
        /* Add more styles as needed */
      </style>
    </head>
    <body>
      ${htmlContent.outerHTML}
    </body>
    </html>`
      : '';
    const blob = new Blob([htmlTable], { type: 'text/html' });
    saveAs(blob, `${releaseA}-${releaseB}-${url}-report.html`);
  }
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  return (
    <Button
      onClick={async () => {
        handleChange(1);
        setResultsPerPage(deltaDocData.results.length);
        await delay(500);
        exportReport();
        setResultsPerPage(9);
      }}
    >
      Download report in HTML
    </Button>
  );
}
