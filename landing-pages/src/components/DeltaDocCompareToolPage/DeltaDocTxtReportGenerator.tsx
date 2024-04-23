import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { statistics } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocTxtReportGenerator() {
  const { releaseA, releaseB, url, deltaDocData } = useDeltaDocContext();

  if (!deltaDocData) {
    return <></>;
  }

  const {
    totalFilesScanned,
    unchangedFiles,
    releaseALength,
    releaseBLength,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
    results,
  } = deltaDocData;

  const statValues = [
    totalFilesScanned,
    unchangedFiles,
    releaseALength,
    releaseBLength,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
  ];

  function exportReport() {
    const reportText = `Comparing ${url} in ${releaseA} and ${releaseB}\nComparison run: ${new Date()}\n\n`;
    const statisticsText = statistics
      .map((stat, index) => {
        if (statValues[index] !== undefined) {
          stat.value = statValues[index]!;
          return `${
            stat.text.includes('ReleaseA') || stat.text.includes('ReleaseB')
              ? stat.text
                  .replace('ReleaseA', releaseA)
                  .replace('ReleaseB', releaseB)
              : stat.text
          }${stat.value}${typeof stat.value == 'string' ? '%' : ''}\n`;
        }
        return '';
      })
      .toString()
      .replaceAll(',', '');

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
    const report = reportText + statisticsText + resultsWithNames;
    var blob = new Blob([report], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${releaseA}-${releaseB}-${url}-report.txt`);
  }
  return <Button onClick={() => exportReport()}>Download report in TXT</Button>;
}
