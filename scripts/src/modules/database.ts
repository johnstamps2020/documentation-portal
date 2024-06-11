import { DitaBuild, Doc, Source, YarnBuild } from '@doctools/server';

async function getEntityByAttribute(
  entityName: string,
  attributeName: string,
  attributeValue: string,
  env: string,
  accessToken: string,
  getRelations: boolean = false
): Promise<any> {
  console.log(
    `Retrieving information for ${attributeName}: "${attributeValue}"`
  );
  let docPortalUrl =
    env == 'prod' ? 'docs.guidewire.com' : 'docs.staging.ccs.guidewire.net';
  const configResponse = await fetch(
    `https://${docPortalUrl}/safeConfig/entity/${entityName}${
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
  env: string,
  accessToken: string
): Promise<DocInfo> {
  let doc: DocInfo['doc'];

  try {
    doc = await getEntityByAttribute('Doc', 'id', docId, env, accessToken);
  } catch (err) {
    console.error(`Could not find a document with id ${docId}`);
    process.exit(1);
  }

  let build: DocInfo['build'];

  build = await getBuildInfoByDocUuid(doc.uuid, env, accessToken);
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
  env: string,
  accessToken: string
): Promise<DitaBuild & YarnBuild> {
  let build: DocInfo['build'];
  console.log(`Retrieving build information for doc.uuid: ${docUuid}`);
  try {
    build = await getEntityByAttribute(
      'DitaBuild',
      'doc.uuid',
      docUuid,
      env,
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
      env,
      accessToken,
      true
    );
  }

  // TODO: just return null instead of erroring out? There are docs with no build configured.
  // Update calling functions to handle that case as needed.
  if (!build) {
    console.error('UNEXPECTED ERROR: The build is somehow not available!');
    process.exit(1);
  }

  return build;
}

async function getAllEntities(
  entityName: string,
  env: string,
  accessToken: string,
  getRelations: boolean = false
): Promise<any> {
  console.log(`Retrieving information for all ${entityName} entities.`);

  let docPortalUrl =
    env == 'prod' ? 'docs.guidewire.com' : 'docs.staging.ccs.guidewire.net';

  const configResponse = await fetch(
    `https://${docPortalUrl}/safeConfig/entity/${entityName}/all${
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
export async function getMatchingDocs(
  query: DocQueryOptions,
  accessToken: string
): Promise<any> {
  console.log(`Retrieving doc configuration entities with metadata`);
  let docPortalUrl =
    query.env == 'prod'
      ? 'docs.guidewire.com'
      : 'docs.staging.ccs.guidewire.net';

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
    `https://${docPortalUrl}/safeConfig/entity/Doc/many/relations?${queryString}`,
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
      build = await getBuildInfoByDocUuid(doc.uuid, query.env, accessToken);
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

export async function getAllDocs(env: string, accessToken: string) {
  let docs: Doc[];

  try {
    docs = await getAllEntities('Doc', env, accessToken, true);
  } catch (err) {
    console.log('Could not fetch all docs configurations from database.');
    process.exit(1);
  }

  return docs;
}
