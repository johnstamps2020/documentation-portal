import { DitaBuild, Doc, Source, YarnBuild } from '@doctools/server';
import { getAccessToken } from './auth';

async function getEntityByAttribute(
  entityName: string,
  attributeName: string,
  attributeValue: string,
  accessToken: string,
  getRelations: boolean = false
): Promise<any> {
  console.log(
    `Retrieving information for ${attributeName}: "${attributeValue}"`
  );
  const configResponse = await fetch(
    `https://docs.staging.ccs.guidewire.net/safeConfig/entity/${entityName}${
      getRelations ? `/relations` : ''
    }?${attributeName}=${attributeValue}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!configResponse.ok) {
    throw new Error(
      `Failed to fetch item from database!\n\n${JSON.stringify(
        configResponse,
        null,
        2
      )}`
    );
  }

  const responseJson = await configResponse.json();
  console.log('Retrieved database entity information.');

  return responseJson;
}

export type DocInfo = {
  doc: Doc;
  build: DitaBuild & YarnBuild;
  source: Source;
  isDita: boolean;
};

export async function getDocInfoByDocId(docId: string): Promise<DocInfo> {
  const accessToken = await getAccessToken();

  let doc: DocInfo['doc'];
  try {
    doc = await getEntityByAttribute('Doc', 'id', docId, accessToken);
  } catch (err) {
    console.error(`Could not find a document with id ${docId}`);
    process.exit(1);
  }

  // TODO move to getBuildInfoByDocId function for reuse
  let build: DocInfo['build'];

  build = await getBuildInfoByDocUuid(doc.uuid, accessToken);
  if (!build) {
    console.error('UNEXPECTED ERROR: The build is somehow not available!');
    process.exit(1);
  }

  return {
    doc,
    build,
    source: build.source,
    isDita: build.root !== undefined,
  };
}

async function getBuildInfoByDocUuid(
  docUuid: string,
  accessToken: string
): Promise<DitaBuild & YarnBuild> {
  let build: DocInfo['build'];
  try {
    build = await getEntityByAttribute(
      'DitaBuild',
      'doc.uuid',
      docUuid,
      accessToken,
      true
    );
  } catch (err) {
    console.log(
      'Could not fetch DITA build configuration from the database. Trying to fetch a yarn build instead of a dita build'
    );
    build = await getEntityByAttribute(
      'YarnBuild',
      'doc.uuid',
      docUuid,
      accessToken,
      true
    );
  }

  if (!build) {
    console.error('UNEXPECTED ERROR: The build is somehow not available!');
    process.exit(1);
  }

  return build;
}

async function getAllEntities(
  entityName: string,
  accessToken: string,
  getRelations: boolean = false
): Promise<any> {
  console.log(`Retrieving information for all ${entityName} entities.`);
  const configResponse = await fetch(
    `https://docs.staging.ccs.guidewire.net/safeConfig/entity/${entityName}/all${
      getRelations ? `/relations` : ''
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!configResponse.ok) {
    throw new Error(
      `Failed to fetch items from database!\n\n${JSON.stringify(
        configResponse,
        null,
        2
      )}`
    );
  }

  const responseJson = await configResponse.json();
  console.log('Retrieved database entities information.');

  return responseJson;
}

export type DocQueryOptions = {
  release?: string;
  product?: string;
  version?: string;
  language?: string;
  env: string;
};
export async function getMatchingDocs(query: DocQueryOptions): Promise<any> {
  console.log(`Retrieving doc configuration entities with metadata`);

  const accessToken = await getAccessToken();

  let queryString = query.release
    ? 'releases[name]=' + query.release + '&'
    : '';

  if (query.product) {
    queryString = queryString.concat(
      queryString.length > 0 ? '&' : '',
      `platformProductVersions[product][name]=${query.product}`
    );
  }

  if (query.version) {
    queryString = queryString.concat(
      queryString.length > 0 ? '&' : '',
      `platformProductVersions[version][name]=${query.version}`
    );
  }

  if (query.language) {
    queryString = queryString.concat(
      queryString.length > 0 ? '&' : '',
      `language[code]=${query.language}`
    );
  }
  if (query.env === 'prod') {
    queryString = queryString.concat(
      queryString.length > 0 ? '&' : '',
      `isInProduction=true`
    );
  }

  const configResponse = await fetch(
    `https://docs.staging.ccs.guidewire.net/safeConfig/entity/Doc/many/relations?${queryString}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!configResponse.ok) {
    throw new Error(
      `Failed to fetch items from database!\n\n${JSON.stringify(
        configResponse,
        null,
        2
      )}`
    );
  }

  const responseJson = await configResponse.json();
  let matchingDocs: DocInfo[] = [];
  const processDocs = async () => {
    const promises = responseJson.map(async (doc: Doc) => {
      let build: DitaBuild & YarnBuild;
      build = await getBuildInfoByDocUuid(doc.uuid, accessToken);
      matchingDocs.push({
        doc,
        build,
        source: build.source,
        isDita: build.root !== undefined,
      });
    });

    await Promise.all(promises);
  };
  await processDocs();

  console.log('Retrieved matching docs information.');
  return matchingDocs;
}

export async function getAllDocs() {
  const accessToken = await getAccessToken();

  let docs: Doc[];

  try {
    docs = await getAllEntities('Doc', accessToken, true);
  } catch (err) {
    console.log('Could not fetch all docs configurations from database.');
    process.exit(1);
  }

  return docs;
}
