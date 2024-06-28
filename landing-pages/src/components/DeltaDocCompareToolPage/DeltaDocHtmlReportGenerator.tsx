import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { resultsPerPageValue, useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocHtmlReportGenerator() {
  const {
    releaseA,
    releaseB,
    deltaDocData,
    firstDoc,
    setResultsPerPage,
    resultsPerPage,
    changePage,
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
      <title>${releaseA} ${releaseB} ${firstDoc?.title} Table Report</title>
      <style>
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
      </style>
    </head>
    <body>
      ${htmlContent.outerHTML}
    </body>
    </html>`
      : '';
    const blob = new Blob([htmlTable], { type: 'text/html' });
    saveAs(blob, `${releaseA}-${releaseB}-${firstDoc?.title}-report.html`);
  }
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const allResultsLength = deltaDocData.results.length;
  return (
    <Button
      onClick={async () => {
        if (resultsPerPage !== allResultsLength) {
          changePage(1);
          setResultsPerPage(allResultsLength);
          await delay(500);
          exportReport();
          setResultsPerPage(resultsPerPageValue);
        } else {
          exportReport();
        }
      }}
    >
      Download report in HTML
    </Button>
  );
}
