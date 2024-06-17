import { DeltaLevenshteinReturnType } from '@doctools/server';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { statistics } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

export function createReport(
  url: string,
  releaseA: string,
  releaseB: string,
  statValues: (number | string)[],
  results: DeltaLevenshteinReturnType[]
) {
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
    .replaceAll(',', '')
    .replaceAll('NaN', '0.00');

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
  const report =
    reportText +
    statisticsText +
    resultsWithNames +
    `-----------------------------------------------------\n\n`;
  return report;
}

export function exportReport(
  report: string,
  releaseA: string,
  releaseB: string,
  identifier: string
) {
  var blob = new Blob([report], {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(blob, `${releaseA}-${releaseB}-${identifier}-report.txt`);
}

function handleReport(
  url: string,
  releaseA: string,
  releaseB: string,
  statValues: (number | string)[],
  results: DeltaLevenshteinReturnType[]
) {
  const reportContent = createReport(
    url,
    releaseA,
    releaseB,
    statValues,
    results
  );
  exportReport(reportContent, releaseA, releaseB, url);
}

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

  return (
    <Button
      onClick={() => handleReport(url, releaseA, releaseB, statValues, results)}
    >
      Download report in TXT
    </Button>
  );
}
