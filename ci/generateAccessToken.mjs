const oktaScopes = `${process.env.OKTA_SCOPES} NODE_Hawaii_Docs_Web.admin`;
const base64ClientCreds = Buffer.from(
  `${process.env.OKTA_CLIENT_ID}:${process.env.OKTA_CLIENT_SECRET}`,
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
console.log(`Token: ${accessToken}`);