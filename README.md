# Set up local development environment

> WARNING: The instructions in this file are for macOS. If you use a different
> OS, adjust them accordingly.

## Make sure you have the required tools installed

You need the following tools:

- Docker
- [nvm](https://github.com/nvm-sh/nvm) for managing Node.js versions. We use
  `.nvmrc` files for automatic version switching.
- Node.js 16.18.0 for running the server (install through nvm)
- Node.js 18.15.0 for loading configs into the database (install through nvm)

## Configure environment variables for the doc portal server

Create a `server/.env` file with the following variables:

> IMPORTANT: Private keys and other sensitive data are not listed below, so you
> need to get them from Password Vault or AWS Secrets Manager.

```
OKTA_CLIENT_ID=
OKTA_CLIENT_SECRET=
OKTA_IDP=
OKTA_ISSUER=https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7
OKTA_SCOPES="NODE_Hawaii_Docs_Web.read"
OKTA_AUDIENCE=Guidewire
OKTA_ADMIN_GROUPS=
APP_BASE_URL=http://localhost:8081
FRONTEND_URL=http://localhost:6006
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
JIRA_AUTH_TOKEN=
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
```

## Start the services

## VS Code

1. Run the "Server DEV" debug. This automatically starts the database and then
   launches the server in dev mode.
1. Make sure you have a `server/.env` file with the required environment
   variables, as described above.
1. Wait for the server to fully start and then run the "Upload Legacy Configs to
   DB" debug. This may take a while.
1. Run the "Landing Pages DEV" debug. This launches the frontend in dev mode.
1. Open http://localhost:8081 in your browser.

### Terminal (macOS)

1. Open a new terminal window and start the database by running:
   ```
   cd server
   ./start_docportal_db_container.sh
   ```
2. Open a new terminal window and start the server by running `yarn server-dev`.
3. Open a new terminal window, export environment variables and load configs
   into the database by running:
   ```
   set -a && source server/.env
   cd ci
   node uploadLegacyConfigsToDb.mjs
   ```
4. Open a new terminal window and start the frontend by running
   `yarn landing-pages-dev`.
