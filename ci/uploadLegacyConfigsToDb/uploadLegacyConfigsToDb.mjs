import { writeFileSync } from 'fs';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const requiredEnvVars = [
  'OKTA_ISSUER',
  'OKTA_SCOPES',
  'APP_BASE_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
];

async function getOktaCredentialsFromSecretsManager() {
  try {
    const client = new SecretsManagerClient();
    const command = new GetSecretValueCommand({
      SecretId: 'tenant-doctools-docportal',
    });
    const data = await client.send(command);
    if ('SecretString' in data) {
      const secret = JSON.parse(data.SecretString);
      return {
        oktaClientId: secret.okta_client_id,
        oktaClientSecret: secret.okta_client_secret,
      };
    }
    return null;
  } catch (err) {
    console.log(err);
  }
}

for (const envVar of requiredEnvVars) {
  if (envVar in process.env) {
    console.log(`${envVar} is set`);
  } else {
    throw new Error(`${envVar} is not set`);
  }
}

console.log('Environment set correctly.');
console.log('OK to start uploading legacy configs to the database...');

const timerName = 'Elapsed time';
console.time(timerName);
const oktaScopes = `${process.env.OKTA_SCOPES} NODE_Hawaii_Docs_Web.admin`;
const { oktaClientId, oktaClientSecret } =
  await getOktaCredentialsFromSecretsManager();
const base64ClientCreds = Buffer.from(
  `${oktaClientId}:${oktaClientSecret}`,
  'utf-8'
).toString('base64');
const jwt = await fetch(
  `${process.env.OKTA_ISSUER}/v1/token?grant_type=client_credentials&scope=${oktaScopes}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64ClientCreds}`,
    },
  }
);

const json = await jwt.json();
if (json.errorCode) {
  throw new Error(
    `Failed to get access token from Okta: ${JSON.stringify(json)}`
  );
}
const accessToken = json.access_token;
console.log('Get access token from Okta: OK');

for (const entityType of ['page', 'source', 'doc', 'build']) {
  console.log(`Uploading entities for ${entityType}...`);
  const response = await fetch(
    `${process.env.APP_BASE_URL}/admin/entity/legacy/${entityType}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await response.json();
  if (response.ok) {
    const jsonFileName = `response_${entityType}.json`;
    writeFileSync(jsonFileName, JSON.stringify(json));
    console.log(
      `Upload entities for ${entityType}: OK. For details, see the ${jsonFileName} file in the build artifacts.`
    );
  } else {
    console.log(
      `Response is not okay for "${entityType}"`,
      JSON.stringify(json)
    );
  }
}

console.timeEnd(timerName);
console.log('Done.');
