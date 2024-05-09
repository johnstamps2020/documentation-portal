import { DeltaDocInputType, DeltaDocResultType } from './../types/deltaDoc';
import {
  getAllDocsFromRelease,
  getAllDocsFromVersion,
} from './searchController';

function capitalizeLetters(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function prepareDocs({
  releaseA,
  releaseB,
  url,
  version,
}: DeltaDocInputType) {
  const releasesToCompare: string[] = [];
  releasesToCompare.push(
    capitalizeLetters(releaseA),
    capitalizeLetters(releaseB)
  );

  const replacementRegex = '.*';
  const regexSearch = url.replace(/\d+.+\d\//, replacementRegex);
  var outputRegex: string = regexSearch.concat(replacementRegex);

  const resultArray = await Promise.all(
    releasesToCompare.map(async (release) => {
      const allDocsFromRelease = version
        ? await getAllDocsFromVersion(release, outputRegex)
        : await getAllDocsFromRelease(release, outputRegex);
      const files = allDocsFromRelease?.hits.hits;
      const releaseObject: DeltaDocResultType[] = [];
      if (files) {
        files.forEach((file) => {
          const idMatch = file._source?.id;
          const titleMatch = file._source?.title;
          const bodyMatch = file._source?.body.trim();
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



