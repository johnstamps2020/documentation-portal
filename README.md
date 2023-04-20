# Set up local env

Use the following environment variables. Private keys etc. are not listed below,
so you need to get them from Password Vault.

OKTA_CLIENT_ID=
OKTA_CLIENT_SECRET=
OKTA_IDP=
OKTA_ISSUER=https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7
OKTA_SCOPES=NODE_Hawaii_Docs_Web.read
OKTA_AUDIENCE=Guidewire
APP_BASE_URL=http://localhost:8081
SESSION_KEY=
DOC_S3_URL=https://docportal-content.staging.ccs.guidewire.net
PORTAL2_S3_URL=https://portal2-content.omega2-andromeda.guidewire.net
ELASTIC_SEARCH_URL=https://docsearch-doctools.staging.ccs.guidewire.net
DEPLOY_ENV=staging
LOCAL_CONFIG=no
ENABLE_AUTH=yes
PRETEND_TO_BE_EXTERNAL=no
ALLOW_PUBLIC_DOCS=yes
LOCALHOST_SESSION_SETTINGS=yes
JIRA_AUTH_TOKEN===
CONFIG_DB_NAME=postgres
CONFIG_DB_USERNAME=postgres
CONFIG_DB_PASSWORD=testtesttest
CONFIG_DB_HOST=0.0.0.0
PARTNERS_LOGIN_URL=https://qaint-guidewire.cs172.force.com/partners/idp/endpoint/HttpRedirect
PARTNERS_LOGIN_CERT=
PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID=https://docs.int.ccs.guidewire.net/partners-login
CUSTOMERS_LOGIN_URL=https://qaint-guidewire.cs172.force.com/customers/idp/endpoint/HttpRedirect
CUSTOMERS_LOGIN_CERT=
CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID=https://docs.int.ccs.guidewire.net/customers-login

# Start developing

To start developing on this branch, you're going to need three terminal windows:

1. Start the database using the `./start_docportal_db_container.sh`.
2. Start the server `yarn server-dev`.
3. Load configs into the database by running:
   ```
   cd ci
   node uploadLegacyConfigsToDb.mjs
   ```
4. Start the client by running `yarn landing-pages-dev`.
