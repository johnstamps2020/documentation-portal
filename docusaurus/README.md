# Docusaurus Guidewire

```
😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎
😎😎😎                                                                      😎😎😎
😎😎😎                          visit our doc site                          😎😎😎
😎😎😎 https://docs.staging.ccs.guidewire.net/docusaurus/guidewire/latest/  😎😎😎
😎😎😎                                                                      😎😎😎
😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎
```

**Important:** If you're **not** planning on deploying to docs.guidewire.com,
**do not use** `gw-theme-classic`. This theme relies on docs.guidewire.com to
provide the search functionality.

To deploy to Atmos, see
[Hosting a static website](https://atmos.internal.guidewire.net/docs/dev/cookbook-static-website).

Themes and plugins for Guidewire Docusaurus apps. To get started:

1. [Bootstrap a Docusaurus site](https://docusaurus.io/docs/installation).
1. [Upgrade to Yarn 3](https://yarnpkg.com/getting-started/migration).
1. Set up your access to Artifactory (see below).
1. Add the Guidewire themes and plugins that you need. See the READMEs in the
   subfolders of this repo.

## Setup access to the @doctools scope in Artifactory (first time only)

This project uses Yarn 3, see `.yarnrc.yml` for details on the setup we use. To
make this project work on you machine, you need a local environment variable
called `NPM_AUTH_TOKEN` available when installing dependencies and or running
the site.

To get the token:

1. From your Okta home, log into Artifactory.
1. In the top right-hand corner, click your username and select **Edit
   profile**.
1. Either copy an existing token, or click **Generate and identity token** and
   copy that.
1. Set the token a the value of an environment variable called `NPM_AUTH_TOKEN`.
1. Restart your terminal, if necessary.

For more information on using Guidewire themes and plugins, see READMEs in
subfolders, e.g., `themes/gw-theme-classic`.

## Deploying to docs.guidewire.com

To include your site on docs.guidewire.com, you need to do the following:

### 1. Set up

Set up a repo with your project. The repo does not have to be Docusaurus, as
long as you can build it with `yarn` and outputs static HTML files. If you want
to deploy a clean SPA, you need to use hask router. For simplicity and
consistency, we've agreed to use `yarn` for JS projects and not `npm`.

If you're using Docusaurus, consider using `@doctools/gw-theme-classic`. It will
hook up search and other aspects of the site. Just follow instructions in the
README in the `themese/gw-theme-classic` folder.

### 2. Configure deployment

Get in touch with doctools@guidewire.com and they can provide assistance.
