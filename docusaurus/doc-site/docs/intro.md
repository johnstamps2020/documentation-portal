---
sidebar_position: 1
---

# Getting started

Deploying to docs.guidewire.com provides the following benefits:

import Benefits from '@site/docs/\_benefits.md'

<Benefits/>

Not convinced? Look at [deploying to Atmos](./deploy-to-atmos.md) without using
a Guidewire theme. You can still use the Redoc plugin.

## Create a new Docusaurus site

[Follow the instructions on the official Docusaurus site](https://docusaurus.io/docs/installation).

Please consider using `yarn` as preferred project manager. The installation command
can be found in Alternative installation commands section
[here](https://docusaurus.io/docs/installation#scaffold-project-website).

## Upgrade to Yarn 3

Use Yarn 3 in builds for docs.guidewire.com. If this is your first time
upgrading Yarn, you may want to read
[the official article about Yarn migration](https://yarnpkg.com/getting-started/migration).

Here are the highlights of the process:

1. Install Yarn 3.

   ```bash
   yarn set version 3.6.4
   ```

   This adds the `.yarn` folder and `.yarnrc.yml` file to your repo.

2. Add the recommended files to `.gitignore`:

   ```git title=".gitignore"
   .pnp.*
   .yarn/*
   !.yarn/patches
   !.yarn/plugins
   !.yarn/releases
   !.yarn/sdks
   !.yarn/versions
   ```

3. In your `.yarnrc.yml` file, after `yarnPath: .yarn/releases/yarn-3.X.X.cjs`,
   add:

   ```js yaml title=".yarnrc.yml"
   nodeLinker: node-modules
   npmAlwaysAuth: true
   npmAuthToken: ${NPM_AUTH_TOKEN}
   npmScopes:
     doctools:
       npmRegistryServer: https://artifactory.guidewire.com/artifactory/api/npm/doctools-npm-dev/
   ```

4. If you have a `yarn.lock` generated with a previous version of Yarn, **delete
   it**.
5. Run `yarn` to install dependencies and update `yarn.lock`.

## trailingSlash

import { RightWrong, Right, Wrong } from "@theme/RightWrong";

<RightWrong>
<Right>

```js title="docusaurus.config.js"
trailingSlash: true,
```

</Right>
<Wrong>

```js title="docusaurus.config.js"
trailingSlash: false,
```

</Wrong>
</RightWrong>

Do not use this setting when posting to docs.guidewire.com. It breaks S3 file
hosting. Leave `trailingSlash` undefined, or set it to `true`. If
`trailingSlash` is not defined in your settings, there is no need to add it, as
it defaults to `true`.

## Setup access to the @doctools scope in Artifactory (first time only)

import Artifactory from './\_set-up-artifactory.md';

<Artifactory/>

## Add Guidewire theme/plugin

- [See set up instructions for the theme](./Themes/Classic/set-up-theme.mdx).
- [See set up instructions for the plugin](./Plugins/Redoc/set-up-plugin.mdx).

## Complex builds

Deployments to docs.guidewire.com run the following commands:

```sh
yarn
yarn build
```

And then they upload the generated files to an S3 bucket.

If you want your site to perform complex steps before publishing, for example
fetch data from an API or build docs from code, we suggest you follow one of
these approaches:

- Add steps to the build command. This means your custom steps run every time
  the site is built. For example:
  ```json title="package.json"
  "my-build": "node someScript.js && python some_program.py",
  "build": "yarn my-build && docusaurus build",
  ```
- Maintain your own pipeline of Teamcity builds which generate docs and commit
  them into your documentation repo. You control when each build is run, for
  example on release, or on various triggers from different repos.

## Configure deployment

Get in touch with The Doctools team and they can provide assistance.

- [#ask-docs](https://guidewire.slack.com/archives/C2LUW57BL) on Slack
- email [doctools@guidewire.com](mailto:doctools@guidewire.com)
