import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import * as dotenv from 'dotenv';

const requiredEnvVars = [
  'OKTA_ISSUER',
  'OKTA_SCOPES',
  'APP_BASE_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
];

dotenv.config();
async function getOktaCredentialsFromSecretsManager(): Promise<any> {
  try {
    const client = new SecretsManagerClient();
    const command = new GetSecretValueCommand({
      SecretId: 'tenant-doctools-docportal',
    });
    const data: any = await client.send(command);
    if ('SecretString' in data) {
      const secret = JSON.parse(data.SecretString);
      return {
        oktaClientId: secret.okta_client_id,
        oktaClientSecret: secret.okta_client_secret,
      };
    }
    return null;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export async function getAccessToken(): Promise<string> {
  for (const envVar of requiredEnvVars) {
    if (envVar in process.env) {
      console.log(`${envVar} is set`);
    } else {
      console.error(`${envVar} is not set`);
      process.exit(1);
    }
  }

  console.log('Environment set correctly.');
  console.log('OK to get access token...');

  const timerName = 'Time needed to get access token from Okta';
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
    console.error(
      `Failed to get access token from Okta: ${JSON.stringify(json)}`
    );
    process.exit(1);
  }
  const accessToken = json.access_token;
  console.log('SUCCESS: Got access token from Okta');
  console.timeEnd(timerName);
  return accessToken;
}
