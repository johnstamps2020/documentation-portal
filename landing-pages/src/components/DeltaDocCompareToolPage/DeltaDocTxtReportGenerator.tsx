import { DeltaLevenshteinReturnType } from '@doctools/server';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { statistics } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

export function createReport(
  firstDocTitle: string,
  releaseA: string[],
  releaseB: string[],
  statValues: (number | string)[],
  results: DeltaLevenshteinReturnType[]
) {
  const reportText = `Comparing "${firstDocTitle}" in ${
    releaseA.length > 2 ? `${(releaseA[0], releaseA[1])}` : releaseA.join(', ')
  } and ${
    releaseB.length > 2 ? `${(releaseB[0], releaseB[1])}` : releaseB.join(', ')
  }\nComparison run: ${new Date()}\n\n`;
  const statisticsText = statistics
    .map((stat, index) => {
      if (statValues[index] !== undefined) {
        stat.value = statValues[index]!;
        return `${
          stat.text.includes('ReleaseA') || stat.text.includes('ReleaseB')
            ? stat.text
                .replace('ReleaseA', releaseA.join())
                .replace('ReleaseB', releaseB.join())
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
    .replaceAll(
      /percentage:\s*(\d+)/g,
      (match, p1) => `Percentage of the file changed: ${p1}%`
    )
    .replaceAll('docAUrl:', `${releaseA} URL: `)
    .replaceAll('docBUrl:', `${releaseB} URL: `);
  const report =
    reportText +
    statisticsText +
    resultsWithNames +
    `-----------------------------------------------------\n\n`;
  return report;
}

export function exportReport(
  report: string,
  releaseA: string | string[],
  releaseB: string | string[],
  identifier: string
) {
  var blob = new Blob([report], {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(blob, `${releaseA}-${releaseB}-${identifier}-report.txt`);
}

function handleReport(
  firstDocTitle: string,
  releaseA: string[],
  releaseB: string[],
  statValues: (number | string)[],
  results: DeltaLevenshteinReturnType[]
) {
  const reportContent = createReport(
    firstDocTitle,
    releaseA,
    releaseB,
    statValues,
    results
  );
  exportReport(reportContent, releaseA, releaseB, firstDocTitle);
}

export default function DeltaDocTxtReportGenerator() {
  const { releaseA, releaseB, firstDoc, firstDocId, deltaDocData } =
    useDeltaDocContext();

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
      onClick={() =>
        handleReport(
          firstDoc ? firstDoc.title : firstDocId,
          releaseA,
          releaseB,
          statValues,
          results
        )
      }
    >
      Download report in TXT
    </Button>
  );
}
