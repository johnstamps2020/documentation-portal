import {
  DeltaDocInputType,
  DeltaDocReturnType,
  DeltaDocTopicType,
} from './../types/deltaDoc';
import { findEntity } from './configController';
import { getAllTopicsFromDoc } from './searchController';

export async function prepareDocs({
  firstDocId,
  secondDocId,
}: DeltaDocInputType): Promise<DeltaDocReturnType> {
  const docIds = [];
  docIds.push(firstDocId, secondDocId);

  const result = await Promise.all(
    docIds.map(async (docId, index) => {
      const allTopicsFromDoc = await getAllTopicsFromDoc(docId);
      const docEntity = await findEntity('Doc', { id: docId }, false);
      const docBaseUrl = docEntity?.url;
      const topics = allTopicsFromDoc?.hits.hits;
      let formattedTopics: DeltaDocTopicType[] = [];
      if (topics) {
        topics.forEach((topic) => {
          const idMatch = topic._source?.id;
          const titleMatch = topic._source?.title;
          const bodyMatch = topic._source?.body.trim();
          const langMatch = topic._source?.language;
          if (idMatch && titleMatch && bodyMatch && langMatch) {
            const id = idMatch;
            const title = titleMatch;
            const body = bodyMatch;
            formattedTopics.push({ id, title, body });
          }
        });
      }
      const nameArray = ['first', 'second'];
      return {
        [`${nameArray[index]}Doc`]: {
          base_url: docBaseUrl,
          topics: formattedTopics,
        },
      };
    })
  );
  const finalResult = result.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  return { status: 200, body: finalResult };
}
