# Set up local development environment

> WARNING: The instructions in this file are for macOS. If you use a different
> OS, adjust them accordingly.

## Step 1: Make sure you have the required tools installed

You need the following tools:

- Docker Desktop
- [nvm](https://github.com/nvm-sh/nvm) for managing Node.js versions. We use
  `.nvmrc` files for automatic version switching.
- Node.js 16.18.0 for running the server (install through nvm)
- Node.js 18.15.0 for loading configs into the database (install through nvm)
- `pg_restore` - it's a command line tool for working with Postgres dumps. It's
  included in the Postgres installation. If you use macOS, you can install it
  through Homebrew: `brew install libpq`.

## Step 2: Make sure Docker Desktop can mount directories from this project

1. Open Docker Desktop.
2. Go to **Settings -> Resources -> File sharing**.
3. Make sure the location of this project is included in the list of directories
   that can be bind mounted into Docker containers.

## Step 3: Configure environment variables for the doc portal server

Create a `server/.env` file with the following variables:

> IMPORTANT: Private keys and other sensitive data are not listed below, so you
> need to get them from Password Vault or AWS Secrets Manager.

> IMPORTANT: If you use docker compose for running the local dev environment,
> you need to set different values for the following variables:
> CONFIG_DB_HOST=db, FRONTEND_URL=http://landing-pages:6006,
> ELASTIC_SEARCH_URL=http://search:9200

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

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-west-2
```

## Step 4: Start the services

Info: After you complete this step, don't be surprised that landing pages don't
work. You need to import a database dump first!

### Docker compose

If you use VS Code, run the **Compose local dev environment** task. If you use
IntelliJ IDEA, run the **Compose local dev environment** configuration. If you
use the terminal, run this command in the root folder of the project:
`docker compose -f .dev/compose-local-dev-env.yml up --build --detach`.

### VS Code

1. Make sure you have the Docker plugin installed and that you are connected to
   the Docker Hub registry.
1. Run the **Server DEV** debug. This automatically creates a Docker container
   for Postgres (docportal DB) and then launches the server in dev mode.
1. Run the **Landing Pages DEV** debug. This launches the frontend in dev mode.
1. Open http://localhost:8081 in your browser.

### IntelliJ IDEA

1. Make sure the Docker plugin is running.
1. Run the **Start docportal DB** configuration. This creates a Docker container
   for Postgres.
1. Wait for the docportal DB to fully start and then run the **Server DEV**
   configuration. This launches the server in dev mode.
1. Run the **Landing pages DEV** configuration. This launches the frontend in
   dev mode.
1. Open http://localhost:8081 in your browser.

### Terminal (macOS)

1. Open a new terminal window and start the database by running:
   ```
   cd server
   ./start_docportal_db_container.sh
   ```
1. Open a new terminal window and start the server by running `yarn server-dev`.
1. Open a new terminal window and start the frontend by running
   `yarn landing-pages-dev`.

## Step 5: Import a database dump

1. From Teamcity, download the latest database dump from the
   [Dump database data from staging](https://gwre-devexp-ci-production-devci.gwre-devops.net/buildConfiguration/DocumentationTools_DocPortal_1678b85abfaa4085ab3305d599569c26#all-projects)
   build. It's in the **Artifacts** tab.
1. Unzip the dump. On macOS, if you simply double-click the downloaded ZIP file,
   it will be extracted into a folder named `docportalconfig`.
1. Open a terminal window and navigate to the folder which contains the recently
   unzipped `docportalconfig` folder.
1. Make sure the docportal DB is running.
1. Run the following command:

   ```bash
   pg_restore --clean --if-exists -d postgres -h localhost -U postgres -W docportalconfig
   ```

1. When prompted for password, enter `testtesttest`.
