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
    console.error('Failed to fetch item from database!');
    console.error(configResponse);
    process.exit(1);
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

  const doc: DocInfo['doc'] = await getEntityByAttribute(
    'Doc',
    'id',
    docId,
    accessToken
  );
  const build: DocInfo['build'] = await getEntityByAttribute(
    'DitaBuild',
    'doc.uuid',
    doc.uuid,
    accessToken,
    true
  );

  return {
    doc,
    build,
    source: build.source,
    isDita: build.root !== undefined,
  };
}
