import {
  DeltaDocResultType,
  DeltaLevenshteinReturnType,
} from '@doctools/server';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDeltaDocData } from 'hooks/useDeltaDocData';
import { useLayoutContext } from 'LayoutContext';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { DeltaDocContextProvider } from 'components/DeltaDocCompareToolPage/DeltaDocLayoutContext';
import DeltaDocUpperPanel from 'components/DeltaDocCompareToolPage/DeltaDocUpperPanel';
import DeltaDocResults from 'components/DeltaDocCompareToolPage/DeltaDocResults';
const difference = require('js-levenshtein');

function calculatePercentage(fileChangeAmount: number, docLength: number) {
  const fractionNumber = fileChangeAmount / docLength;
  const percentageNumber = fractionNumber * 100;
  return percentageNumber;
}

export function compareDocs(deltaDocData: DeltaDocResultType[][]) {
  const releaseAFiles = deltaDocData[0];
  const releaseBFiles = deltaDocData[1];
  var cumulativeFileChanges = 0;
  let unchangedFiles = 0;
  const areReleasesIdentical = releaseAFiles === releaseBFiles;

  // TODO: statistics: equal entries: xx, distinct entries: xx, left only entries: xx, right only entries: xx, differences: xx

  releaseBFiles.forEach(function (b) {
    if (
      releaseAFiles.some(function (a) {
        return a.id === b.id && a.body === b.body && a.title === b.title;
      })
    ) {
      unchangedFiles++;
    }
  });

  const differentFiles: DeltaDocResultType[] = [];
  if (areReleasesIdentical === false) {
    const releaseADocIds: string[] = releaseAFiles.map((file) => {
      return file.id;
    });
    const releaseBDocIds: string[] = releaseBFiles.map((file) => {
      return file.id;
    });
    releaseBFiles.forEach(function (b) {
      if (
        releaseAFiles.some((a) => {
          // file exists in both releases and is different
          return a.id === b.id && JSON.stringify(a) !== JSON.stringify(b);
        }) ||
        !releaseADocIds.includes(b.id) // file exists in B but doesn't exist in A
      ) {
        differentFiles.push(b);
      }
    });
    releaseAFiles.forEach(function (a) {
      if (!releaseBDocIds.includes(a.id)) {
        differentFiles.push(a);
      }
    });
  }

  function compareTwoDocs(docA: DeltaDocResultType, docB: DeltaDocResultType) {
    const fileChangeAmount: number = difference(docA.body, docB.body);
    console.log(docA, docB);
    var percentageChange: number = Math.ceil(
      calculatePercentage(fileChangeAmount, docB.body.length)
    );
    if (percentageChange > 100) {
      percentageChange = 100;
    }
    var docURL;
    if (!docA.id) {
      docURL = docB.id;
    } else {
      docURL = docA.id;
    }
    const output: DeltaLevenshteinReturnType = {
      URL: docURL,
      docATitle: docA.title,
      docBTitle: docB.title,
      changes: fileChangeAmount,
      percentage: percentageChange,
    };
    cumulativeFileChanges += percentageChange;
    return output;
  }

  function compareAllDocs() {
    const dirCompareResults = differentFiles;
    console.log(dirCompareResults.length);
    const comparisonResults = [];
    for (const dirCompareResult of dirCompareResults) {
      var fileA: DeltaDocResultType;
      var fileB: DeltaDocResultType;
      const releaseAFind = releaseAFiles.find(
        (file) => file.id === dirCompareResult.id
      );
      const releaseBFind = releaseBFiles.find(
        (file) => file.id === dirCompareResult.id
      );
      const emptyReleaseObject: DeltaDocResultType = {
        id: '',
        title: 'N/A - file does not exist',
        body: ' ',
      };
      if (releaseAFind) {
        fileA = releaseAFind;
      } else {
        fileA = emptyReleaseObject;
      }
      if (releaseBFind) {
        fileB = releaseBFind;
      } else {
        fileB = emptyReleaseObject;
      }
      const levenshteinResult = compareTwoDocs(fileA, fileB);
      comparisonResults.push(levenshteinResult);
    }
    return comparisonResults;
  }

  function scanFileCount(
    filesA: DeltaDocResultType[],
    filesB: DeltaDocResultType[]
  ) {
    const filesAFileCount = filesA.length;
    const filesBFileCount = filesB.length;
    var outputFileCount;
    if (filesAFileCount != filesBFileCount) {
      return (outputFileCount =
        filesAFileCount - 1 + Math.abs(filesAFileCount - filesBFileCount));
    } else {
      return (outputFileCount = filesAFileCount);
    }
  }

  function docBasePercentageTotal(
    totalFilesScanned: number,
    differentFiles: number
  ) {
    // const fileDifferenceNumber = unchangedFiles / totalFilesScanned;
    // const percentageNumber = 100 - fileDifferenceNumber * 100;
    // const totalFilePercentageNumber = totalFilesScanned * 100;
    // const docBasePercentageChange =
    //   (cumulativeFileChanges / totalFilePercentageNumber) * 100;
    const fileDifferenceNumber = differentFiles / totalFilesScanned;
    const percentageNumber = fileDifferenceNumber * 100;
    const totalFilePercentageNumber = totalFilesScanned * 100;
    const docBasePercentageChange =
      (cumulativeFileChanges / totalFilePercentageNumber) * 100;
    return [percentageNumber.toFixed(2), docBasePercentageChange.toFixed(2)];
  }

  const totalFilesScanned = scanFileCount(releaseAFiles, releaseBFiles);
  const results = compareAllDocs();
  const [docBaseFileChanges, docBaseFilePercentageChanges] =
    docBasePercentageTotal(totalFilesScanned, differentFiles.length);
  console.log(`Percentage of files in the doc base that were edited: ${docBaseFileChanges}%
Percentage that the doc base changed by between the two releases: ${docBaseFilePercentageChanges}%`);
  const releaseALength = releaseAFiles.length;
  const releaseBLength = releaseBFiles.length;

  return {
    results,
    areReleasesIdentical,
    unchangedFiles,
    totalFilesScanned,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
    releaseALength,
    releaseBLength,
  };
}

export default function DeltaDocCompareToolPage() {
  const { setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Delta Doc Comparison Tool');
  }, [setTitle]);

  return (
    <DeltaDocContextProvider>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'fit-content',
        }}
      >
        <Container
          sx={{
            padding: '3rem 0',
          }}
        >
          <DeltaDocUpperPanel />
          <DeltaDocResults />
        </Container>
      </Grid>
    </DeltaDocContextProvider>
  );
}
