import { DeltaLevenshteinReturnType } from '@doctools/server';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocReportGenerator({
  results,
}: {
  results: DeltaLevenshteinReturnType[];
}) {
  const { releaseA, releaseB, url, totalFilesScanned } = useDeltaDocContext();

  function exportReport() {
    const reportText = `Comparing ${url} in ${releaseA} and ${releaseB}\nFiles scanned: ${totalFilesScanned}\nComparison run: ${new Date()}`;
    const resultsWithNames = JSON.stringify(results)
      .replaceAll(',', `\n`)
      .replaceAll('{', `\n`)
      .replaceAll('}', `\n`)
      .replaceAll('[', `\n`)
      .replaceAll(']', `\n`)
      .replaceAll('"', ``)
      .replaceAll('docATitle:', `${releaseA} title: `)
      .replaceAll('docBTitle:', `${releaseB} title: `)
      .replaceAll('changes:', 'Number of changes: ')
      .replaceAll('percentage:', 'Percentage of the file changed: ')
      .replaceAll('URL:', 'URL: ');
    const report = reportText + resultsWithNames;
    var blob = new Blob([report], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${releaseA}-${releaseB}-${url}-report.txt`);
  }
  return <Button onClick={() => exportReport()}>Download report</Button>;
}
