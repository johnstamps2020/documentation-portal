import {
  DeltaDocInputType,
  DeltaDocResultType,
  DeltaLevenshteinReturnType,
} from '@doctools/server';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import useSWR, { Fetcher } from 'swr';
import { Error } from './useEntitiesData';
const difference = require('js-levenshtein');

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
        title: `${fileDoesNotExistText}`,
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

export type DeltaDocData = {
  results: DeltaLevenshteinReturnType[];
  areReleasesIdentical: boolean;
  unchangedFiles: number;
  totalFilesScanned: number;
  docBaseFileChanges: string;
  docBaseFilePercentageChanges: string;
  releaseALength: number;
  releaseBLength: number;
};

const deltaDocDataGetter: Fetcher<DeltaDocData, DeltaDocInputType> = async ({
  releaseA,
  releaseB,
  url,
}) => {
  const response = await fetch(
    `/delta/results?releaseA=${releaseA}&releaseB=${releaseB}&url=${url}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  const regexSearch = url.replace(/\d+/, '......');
  const outputRegex = new RegExp(regexSearch, 'g');
  const stringifiedData = JSON.stringify(jsonData).replaceAll(outputRegex, '/');
  const parsedData: DeltaDocResultType[][] = JSON.parse(stringifiedData);
  const deltaDocData = parsedData.map((releaseData) =>
    releaseData.filter((element) => {
      return element.id.replace(/[0-9]/g, '') !== url.replace(/[0-9]/g, '');
    })
  );

  const comparisonResult = compareDocs(deltaDocData);

  return comparisonResult;
};

export function useDeltaDocData({
  releaseA,
  releaseB,
  url,
}: DeltaDocInputType) {
  const { data, error, isLoading } = useSWR<DeltaDocData, Error>(
    { releaseA, releaseB, url },
    deltaDocDataGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    deltaDocData: data,
    isLoading,
    isError: error,
  };
}