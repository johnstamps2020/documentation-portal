import {
  DeltaDocInputType,
  DeltaDocReturnType,
  DeltaDocTopicType,
  DeltaLevenshteinReturnType,
  Doc,
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

function removeReleaseIdentifier(id: string, baseUrl: string) {
  return id.replace(baseUrl, '');
}

export function compareDocs(deltaDocData: DeltaDocReturnType['body']) {
  const firstDocTopics = deltaDocData.firstDoc.topics;
  const secondDocTopics = deltaDocData.secondDoc.topics;
  const firstDocBaseUrl = `${deltaDocData.firstDoc.base_url}/`;
  const secondDocBaseUrl = `${deltaDocData.secondDoc.base_url}/`;
  let cumulativeFileChanges = 0;
  let unchangedFiles = 0;
  const areReleasesIdentical =
    JSON.stringify(
      firstDocTopics.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
    ) ===
    JSON.stringify(
      secondDocTopics.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
    );

  secondDocTopics.forEach(function (topicB) {
    if (
      firstDocTopics.some(function (topicA) {
        return (
          removeReleaseIdentifier(topicA.id, firstDocBaseUrl) ===
            removeReleaseIdentifier(topicB.id, secondDocBaseUrl) &&
          topicA.body === topicB.body &&
          topicA.title === topicB.title
        );
      })
    ) {
      unchangedFiles++;
    }
  });

  const differentFiles: DeltaDocTopicType[] = [];
  if (areReleasesIdentical === false) {
    const releaseADocIds: string[] = firstDocTopics.map((topicA) => {
      return removeReleaseIdentifier(topicA.id, firstDocBaseUrl);
    });
    const releaseBDocIds: string[] = secondDocTopics.map((topicB) => {
      return removeReleaseIdentifier(topicB.id, secondDocBaseUrl);
    });
    secondDocTopics.forEach(function (topicB) {
      if (
        firstDocTopics.some((topicA) => {
          // file exists in both releases and is different
          const topicANoRelease = {
            ...topicA,
            id: removeReleaseIdentifier(topicA.id, firstDocBaseUrl),
          };
          const topicBNoRelease = {
            ...topicB,
            id: removeReleaseIdentifier(topicB.id, secondDocBaseUrl),
          };
          return (
            topicANoRelease.id === topicBNoRelease.id &&
            JSON.stringify(topicANoRelease) !== JSON.stringify(topicBNoRelease)
          );
        }) ||
        !releaseADocIds.includes(
          removeReleaseIdentifier(topicB.id, secondDocBaseUrl)
        ) // file exists in B but doesn't exist in A
      ) {
        differentFiles.push(topicB);
      }
    });
    firstDocTopics.forEach(function (topicA) {
      if (
        !releaseBDocIds.includes(
          removeReleaseIdentifier(topicA.id, firstDocBaseUrl)
        )
      ) {
        differentFiles.push(topicA);
      }
    });
  }

  function compareTwoDocs(
    topicA: DeltaDocTopicType,
    topicB: DeltaDocTopicType
  ) {
    const docABody = topicA.body.trim();
    const docBBody = topicB.body.trim();
    const fileChangeAmount: number = difference(docABody, docBBody);
    var percentageChange: number =
      fileChangeAmount !== 0
        ? Math.ceil(
            calculatePercentage(
              fileChangeAmount,
              docBBody.length > docABody.length
                ? docBBody.length
                : docABody.length
            )
          )
        : 0;
    if (percentageChange > 100) {
      percentageChange = 100;
    }

    const output: DeltaLevenshteinReturnType = {
      docAUrl: topicA.id,
      docBUrl: topicB.id,
      docATitle: topicA.title,
      docBTitle: topicB.title,
      changes: fileChangeAmount,
      percentage: percentageChange,
    };
    cumulativeFileChanges += percentageChange;
    return output;
  }

  function compareAllDocs() {
    const comparisonResults = [];
    for (const differentFile of differentFiles) {
      var topicA: DeltaDocTopicType;
      var topicB: DeltaDocTopicType;
      const firstDocFoundTopic = firstDocTopics.find(
        (firstTopic) =>
          removeReleaseIdentifier(firstTopic.id, firstDocBaseUrl) ===
          removeReleaseIdentifier(
            removeReleaseIdentifier(differentFile.id, firstDocBaseUrl),
            secondDocBaseUrl
          )
      );
      const secondDocFoundTopic = secondDocTopics.find(
        (secondTopic) =>
          removeReleaseIdentifier(secondTopic.id, secondDocBaseUrl) ===
          removeReleaseIdentifier(
            removeReleaseIdentifier(differentFile.id, firstDocBaseUrl),
            secondDocBaseUrl
          )
      );
      const emptyReleaseObject: DeltaDocTopicType = {
        id: '',
        title: `${fileDoesNotExistText}`,
        body: ' ',
      };
      if (firstDocFoundTopic) {
        topicA = firstDocFoundTopic;
      } else {
        topicA = emptyReleaseObject;
      }
      if (secondDocFoundTopic) {
        topicB = secondDocFoundTopic;
      } else {
        topicB = emptyReleaseObject;
      }
      const levenshteinResult = compareTwoDocs(topicA, topicB);
      comparisonResults.push(levenshteinResult);
    }
    return comparisonResults;
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

  const results = compareAllDocs();
  const totalFilesScanned = results.length + unchangedFiles;
  const [docBaseFileChanges, docBaseFilePercentageChanges] =
    docBasePercentageTotal(totalFilesScanned, differentFiles.length);
  const releaseALength = firstDocTopics.length;
  const releaseBLength = secondDocTopics.length;

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
  firstDocId,
  secondDocId,
}) => {
  const response = await fetch(
    `/delta/results?firstDocId=${firstDocId}&secondDocId=${secondDocId}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }
  const comparisonResult = compareDocs(jsonData);
  return comparisonResult;
};

export function useDeltaDocData({
  firstDocId,
  secondDocId,
}: DeltaDocInputType) {
  const shouldFetch = firstDocId && secondDocId;
  const { data, error, isLoading } = useSWR<DeltaDocData, Error>(
    shouldFetch ? { firstDocId, secondDocId } : null,
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

const docsByProductGetter = async (productName: string) => {
  const response = await fetch(
    `/safeConfig/entity/Doc/many/relations?platformProductVersions[product][name]=${productName}`
  );

  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useDocsByProduct(docUrl?: string) {
  const { data, error, isLoading } = useSWR<Doc[], Error>(
    docUrl,
    docsByProductGetter,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    docs: data,
    isLoading,
    isError: error,
  };
}

const batchDeltaDocDataGetter: Fetcher<
  (DeltaDocData & {
    firstDocId: string;
    secondDocId: string;
  })[],
  DeltaDocInputType[]
> = async (inputArray) => {
  const comparisonResultArray: (DeltaDocData & {
    firstDocId: string;
    secondDocId: string;
  })[] = [];
  for (const { firstDocId, secondDocId } of inputArray) {
    if (!firstDocId || !secondDocId) {
      continue;
    }
    const response = await fetch(
      `/delta/results?firstDocId=${firstDocId}&secondDocId=${secondDocId}`
    );
    const { status } = response;
    const jsonData = await response.json();

    if (!response.ok) {
      console.error(status, await jsonData.message);
    }

    const comparisonResult = compareDocs(jsonData);
    comparisonResultArray.push({
      ...comparisonResult,
      firstDocId,
      secondDocId,
    });
  }

  return comparisonResultArray;
};

export function useBatchDeltaDocData(inputArray: DeltaDocInputType[]) {
  const { data, error, isLoading } = useSWR<
    (DeltaDocData & {
      firstDocId: string;
      secondDocId: string;
    })[],
    Error
  >(inputArray, batchDeltaDocDataGetter, {
    revalidateOnFocus: false,
  });

  return {
    deltaDocBatchData: data,
    isLoading,
    isError: error,
  };
}
