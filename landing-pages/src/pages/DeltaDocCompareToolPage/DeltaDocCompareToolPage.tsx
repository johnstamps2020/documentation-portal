import {
  DeltaDocResultType,
  DeltaLevenshteinReturnType,
} from '@doctools/server';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import { useLayoutContext } from 'LayoutContext';
import Grid from '@mui/material/Grid';
import { DeltaDocContextProvider } from 'components/DeltaDocCompareToolPage/DeltaDocContext';
import DeltaDocUpperPanel from 'components/DeltaDocCompareToolPage/DeltaDocUpperPanel';
import DeltaDocResults from 'components/DeltaDocCompareToolPage/DeltaDocResults';
import DeltaDocStatistics from 'components/DeltaDocCompareToolPage/DeltaDocStatistics';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
const difference = require('js-levenshtein');

export const fileDoesNotExistText = 'N/A - file does not exist';

function calculatePercentage(fileChangeAmount: number, docLength: number) {
  const fractionNumber = fileChangeAmount / docLength;
  const percentageNumber = fractionNumber * 100;
  return percentageNumber;
}

export function compareDocs(deltaDocData: DeltaDocResultType[][]) {
  const releaseAFiles = deltaDocData[0];
  const releaseBFiles = deltaDocData[1];
  let cumulativeFileChanges = 0;
  let unchangedFiles = 0;
  const areReleasesIdentical = releaseAFiles === releaseBFiles;

  // TODO: statistics:  left only entries: xx, right only entries: xx,

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
    if (filesAFileCount !== filesBFileCount) {
      return filesAFileCount - 1 + Math.abs(filesAFileCount - filesBFileCount);
    } else {
      return filesAFileCount;
    }
  }

  function docBasePercentageTotal(
    totalFilesScanned: number,
    differentFiles: number
  ) {
    const fileDifferenceNumber = differentFiles / totalFilesScanned;
    let percentageNumber = fileDifferenceNumber * 100;
    const totalFilePercentageNumber = totalFilesScanned * 100;
    let docBasePercentageChange =
      (cumulativeFileChanges / totalFilePercentageNumber) * 100;
    if (docBasePercentageChange > 100) {
      docBasePercentageChange = 100;
    }
    if (percentageNumber > 100) {
      percentageNumber = 100;
    }
    return [percentageNumber.toFixed(2), docBasePercentageChange.toFixed(2)];
  }

  const totalFilesScanned = scanFileCount(releaseAFiles, releaseBFiles);
  const results = compareAllDocs();
  const [docBaseFileChanges, docBaseFilePercentageChanges] =
    docBasePercentageTotal(totalFilesScanned, differentFiles.length);
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
          <Typography variant="h1" marginBottom="16px">
            Compare documents between releases
          </Typography>
          <Stack direction="row">
            <DeltaDocUpperPanel />
            <DeltaDocStatistics />
          </Stack>
          <Divider sx={{ m: '8px 0 40px 0', width: '100%' }} />
          <DeltaDocResults />
        </Container>
      </Grid>
    </DeltaDocContextProvider>
  );
}
