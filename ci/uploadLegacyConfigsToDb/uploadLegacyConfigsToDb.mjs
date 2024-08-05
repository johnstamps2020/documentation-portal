import { writeFileSync } from 'fs';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

function validateEnvironment() {
  const requiredEnvVars = [
    'OKTA_ISSUER',
    'OKTA_SCOPES',
    'APP_BASE_URL',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
  ];
  for (const envVar of requiredEnvVars) {
    if (!(envVar in process.env)) {
      throw new Error(`${envVar} is not set`);
    }
    console.log(`${envVar} is set`);
  }
  console.log('Environment set correctly.');
}

async function sendRequest(method, endpoint, accessToken) {
  const response = await fetch(`${process.env.APP_BASE_URL}${endpoint}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

function writeResponseToFile(JsonContent, fileName) {
  writeFileSync(fileName, JSON.stringify(JsonContent));
}

async function getOktaCredentialsFromSecretsManager() {
  const client = new SecretsManagerClient();
  const command = new GetSecretValueCommand({
    SecretId: 'tenant-doctools-docportal',
  });
  const data = await client.send(command);
  if (!('SecretString' in data)) {
    throw new Error(`Get Okta credentials from the Secrets Manager: FAILED`);
  }

  const secret = JSON.parse(data.SecretString);
  console.log('Get Okta credentials from the Secrets Manager: OK');
  return {
    oktaClientId: secret.okta_client_id,
    oktaClientSecret: secret.okta_client_secret,
  };
}

async function getAccessTokenFromOkta() {
  const oktaScopes = `${process.env.OKTA_SCOPES} NODE_Hawaii_Docs_Web.admin`;
  const { oktaClientId, oktaClientSecret } =
    await getOktaCredentialsFromSecretsManager();
  const base64ClientCreds = Buffer.from(
    `${oktaClientId}:${oktaClientSecret}`,
    'utf-8'
  ).toString('base64');

  const response = await fetch(
    `${process.env.OKTA_ISSUER}/v1/token?grant_type=client_credentials&scope=${oktaScopes}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64ClientCreds}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Get access token from Okta: FAILED. Response status: ${response.status}`
    );
  }

  const json = await response.json();
  if (json.errorCode) {
    throw new Error(
      `Get access token from Okta: FAILED. Response: ${JSON.stringify(json)}`
    );
  }
  console.log('Get access token from Okta: OK');
  return json.access_token;
}

async function uploadEntitiesToDb(accessToken) {
  console.log('Uploading legacy configs to the database...');
  let uploadCompletedWithErrors = false;
  for (const entityType of ['source', 'doc', 'build']) {
    const requestMethod = 'PUT';
    const endpointUrl = `/admin/entity/legacy/${entityType}`;
    console.log(`Uploading entities for "${entityType}"...`);
    const response = await sendRequest(requestMethod, endpointUrl, accessToken);
    const json = await response.json();
    const jsonFileName = `response_${entityType}.json`;
    writeResponseToFile(json, jsonFileName);
    if (response.ok) {
      console.log(
        `Upload legacy configs for "${entityType}": OK. For details, see the ${jsonFileName} file in the build artifacts.`
      );
    } else {
      uploadCompletedWithErrors = true;
      console.log(
        `Upload legacy configs for "${entityType}": FAILED. For details, see the ${jsonFileName} file in the build artifacts.`
      );
    }
  }
  if (uploadCompletedWithErrors) {
    throw new Error('Upload legacy configs to the database: FAILED');
  }
  console.log(`Upload legacy configs to the database: OK`);
}

async function cleanUpDatabase(accessToken) {
  console.log(`Cleaning up the database...`);
  const response = await sendRequest(
    'GET',
    '/admin/entities/clean',
    accessToken
  );
  const json = await response.json();
  const jsonFileName = `response_clean_db.json`;
  writeResponseToFile(json, jsonFileName);
  if (!response.ok) {
    throw new Error(
      `Clean up the database: FAILED. For details, see the ${jsonFileName}.`
    );
  }
  console.log(
    `Clean up the database: OK. For details, see the ${jsonFileName} file in the build artifacts.`
  );
}

validateEnvironment();

const timerName = 'Elapsed time';
console.time(timerName);

const oktaAccessToken = await getAccessTokenFromOkta();
await uploadEntitiesToDb(oktaAccessToken);
await cleanUpDatabase(oktaAccessToken);

console.timeEnd(timerName);
console.log('Done.');
