import { getAccessToken } from './auth';

async function getEntityByAttribute(
  entityName: string,
  attributeName: string,
  attributeValue: string,
  accessToken: string
): Promise<any> {
  console.log(
    `Retrieving information for ${attributeName}: ${attributeValue}...`
  );
  const configResponse = await fetch(
    `https://docs.staging.ccs.guidewire.net/safeConfig/entity/${entityName}?${attributeName}=${attributeValue}`,
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

export async function getDocInfoByDocId(docId: string): Promise<{
  doc: any;
  build: any;
  source: any;
}> {
  const accessToken = await getAccessToken();

  const doc = await getEntityByAttribute('Doc', 'id', docId, accessToken);

  return {
    doc,
    build: null,
    source: null,
  };
}
