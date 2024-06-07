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

  let build: DocInfo['build'];
  try {
    build = await getEntityByAttribute(
      'DitaBuild',
      'doc.uuid',
      doc.uuid,
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
      doc.uuid,
      accessToken,
      true
    );
  }

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

export async function getMatchingDocs(
  release?: string,
  product?: string,
  version?: string
): Promise<any> {
  console.log(`Retrieving doc configuration entities with metadata`);
  console.log(`product: ${product}`);
  console.log(`version: ${version}`);

  const accessToken = await getAccessToken();

  let queryString = release ? 'releases[name]=' + release + '&' : '';
  if (product) {
    queryString = queryString.concat(
      `platformProductVersions[product][name]=${product}`,
      version ? '&' : ''
    );
  }

  if (version) {
    queryString = queryString.concat(
      `platformProductVersions[version][name]=${version}`
    );
  }

  console.log(`queryString: ${queryString}`);

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
  console.log('Retrieved database entities information.');

  return responseJson;
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
