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
