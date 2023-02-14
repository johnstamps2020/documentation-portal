# Documentation portal

This is a JS/TS monorepo which uses Yarn 3.

## Developing

1. Set up access to Artifactory (one-time action see below)
1. Run `yarn`
1. See `package.json` for a list of available commands

## Setting up access to Artifactory (one-time)

This project uses Yarn 3, see `.yarnrc.yml` for details on the setup we use. To
make this project work on you machine, you need a local environment variable
called `NPM_AUTH_TOKEN` available when installing dependencies and/or running
the site.

To get the token:

1. From your Okta home, log into Artifactory.
1. In the top right-hand corner, click your username and select **Edit
   profile**.
1. Either copy an existing token, or click **Generate an identity token** and
   copy that.
1. Set the token as the value of an environment variable called
   `NPM_AUTH_TOKEN`.
1. Restart your terminal, if necessary.