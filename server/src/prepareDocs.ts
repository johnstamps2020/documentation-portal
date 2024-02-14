import { getAllDocsFromRelease } from './controllers/searchController';
const difference = require('levenshtein-js');
import { isEqual } from 'lodash';
import { DeltaDocInputType, DeltaDocResultType, DeltaLevenshteinReturnType } from './types/deltaDoc';

function calculatePercentage(fileChangeAmount: number, docLength: number) {
  const fractionNumber = fileChangeAmount / docLength;
  const percentageNumber = fractionNumber * 100;
  return percentageNumber;
}



function capitalizeLetters(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function prepareDocs({
  releaseA,
  releaseB,
  url,
}: DeltaDocInputType) {
  const releasesToCompare: string[] = [];
  releasesToCompare.push(
    capitalizeLetters(releaseA),
    capitalizeLetters(releaseB)
  );

  const replacementRegex = '.*';
  const regexSearch = url.replace(/\d+/, replacementRegex);
  var outputRegex: string = regexSearch.concat(replacementRegex);

  const resultArray = await Promise.all(
    releasesToCompare.map(async (release) => {
      const allDocsFromRelease = await getAllDocsFromRelease(
        release,
        outputRegex
      );
      const files = allDocsFromRelease?.hits.hits;
      const releaseObject: DeltaDocResultType[] = [];
      if (files) {
        files.forEach((file) => {
          const idMatch = file._source?.id;
          const titleMatch = file._source?.title;
          const bodyMatch = file._source?.body;
          const langMatch = file._source?.language;
          if (idMatch && titleMatch && bodyMatch && langMatch) {
            var urlSliceArray = idMatch.split('/');
            var arrayDuplicates = (urlSliceArray: string[]) =>
              urlSliceArray.filter(
                (item, index) => urlSliceArray.indexOf(item) !== index
              );
            var duplicateElements = arrayDuplicates(urlSliceArray);
            var regexSearch = new RegExp(
              `.*\/\\d+\/${duplicateElements[0]}\/${duplicateElements[0]}\/`
            );
            var duplicateRegex = `/${duplicateElements[0]}/`;
            const id = idMatch.replace(regexSearch, duplicateRegex);
            const title = titleMatch;
            const body = bodyMatch;
            releaseObject.push({ id, title, body });
            return;
          }
        });
        return releaseObject;
      } else {
        console.log(`No hits for release ${release} and query ${outputRegex}`);
        return releaseObject;
      }
    })
  );
  return { status: 200, body: resultArray };
}

export async function compareDocs({
  releaseA,
  releaseB,
  url,
}: DeltaDocInputType) {
  const files = await prepareDocs({
    releaseA,
    releaseB,
    url,
  });
  console.log(files);
  const releaseAFiles = files.body[0];
  const releaseBFiles = files.body[1];
  var cumulativeFileChanges = 0;
  let count = 0;
  const result = isEqual(releaseAFiles, releaseBFiles);
  console.log('Directories are %s', result ? 'identical' : 'different');

  // TODO: statistics: equal entries: xx, distinct entries: xx, left only entries: xx, right only entries: xx, differences: xx

  releaseBFiles.forEach(function (b) {
    if (
      releaseAFiles.some(function (a) {
        return isEqual(a, b);
      })
    ) {
      count++;
    }
  });
  const unchangedFiles = count;

  const filesLength =
    releaseAFiles.length > releaseBFiles.length
      ? releaseAFiles.length
      : releaseBFiles.length;
  const changedFilesPercent =
    100 - calculatePercentage(unchangedFiles, filesLength);
  console.log(
    `Identical entries: ${count}, 
${releaseA} file count: ${releaseAFiles.length},
${releaseB} file count: ${releaseBFiles.length},
Percentage of files in the doc base that were edited: ${changedFilesPercent.toFixed(
      2
    )}%`
  );

  const differentFiles: DeltaDocResultType[] = [];
  if (result === false) {
    releaseBFiles.forEach(function (b) {
      if (
        releaseAFiles.some((file) => {
          return file.id === b.id && JSON.stringify(file) !== JSON.stringify(b);
        })
      ) {
        differentFiles.push(b);
      }
    });
  } else {
    console.log('Releases are identical');
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
    // Sets the url for the result
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
        title: '',
        body: '',
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
    totalFileScanned: number,
    unchangedFiles: number
  ) {
    const fileDifferenceNumber = unchangedFiles / totalFileScanned;
    const percentageNumber = 100 - fileDifferenceNumber * 100;
    const totalFilePercentageNumber = totalFileScanned * 100;
    const docBasePercentageChange =
      (cumulativeFileChanges / totalFilePercentageNumber) * 100;

    console.log({
      cumulativeFileChanges,
      totalFilePercentageNumber,
      docBasePercentageChange,
    });
    return [percentageNumber, docBasePercentageChange];
  }

  const totalFileScanned = scanFileCount(releaseAFiles, releaseBFiles);
  console.log(`Files scanned: ${totalFileScanned}`);
  const results = compareAllDocs();
  const [docBaseFileChanges, docBaseFilePercentageChanges] =
    docBasePercentageTotal(totalFileScanned, unchangedFiles);
  console.log(`Percentage of files in the doc base that were edited: ${docBaseFileChanges.toFixed(
    2
  )}%
Percentage that the doc base changed by between the two releases: ${docBaseFilePercentageChanges.toFixed(
    2
  )}%`);
  return { status: 200, body: results };
}
