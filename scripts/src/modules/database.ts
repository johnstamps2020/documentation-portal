import { DitaBuild, Doc, Source, YarnBuild } from '@doctools/server';

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

export async function deleteEntityById(
  repo: string,
  id: string,
  accessToken: string,
  host: string
) {
  console.log(`Attempting to delete entity from ${repo} with ID: ${id}`);

  const endpoint = host + '/admin/entity/' + repo;
  const deleteResponse = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  });

  if (!deleteResponse.ok) {
    if (deleteResponse.status === 404) {
      return console.log('404: Not found', { repo, id, host });
    }

    console.log(
      'DELETE response is not OK',
      endpoint,
      deleteResponse.status,
      deleteResponse.statusText
    );
    throw new Error(
      `Failed to delete!',\n\n${JSON.stringify(deleteResponse, null, 2)}`
    );
  }

  const responseBody = await deleteResponse.json();
  console.log(
    `DELETE operation result: ${JSON.stringify(responseBody, null, 2)}`
  );
}

export type DocInfo = {
  doc: Doc;
  build: DitaBuild & YarnBuild;
  source: Source;
  isDita: boolean;
};

export async function getDocInfoByDocId(
  docId: string,
  accessToken: string
): Promise<DocInfo> {
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
