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

## Upgrade to Yarn 3

Use Yarn 3 in builds for docs.guidewire.com.

1. Upgrade your site to Yarn 3.
1. At the root of your site, set up `.yarnrc.yml` similar to the following

```yml
yarnPath: .yarn/releases/yarn-3.3.0.cjs
nodeLinker: node-modules
npmAlwaysAuth: true
npmAuthToken: ${NPM_AUTH_TOKEN}
npmScopes:
  doctools:
    npmRegistryServer: https://artifactory.guidewire.com/artifactory/api/npm/doctools-npm-dev/
```

## trailingSlash

import { RightWrong, Right, Wrong } from "@theme/RightWrong";

<RightWrong>
<Wrong>

```js
trailingSlash: false,
```

</Wrong>
</RightWrong>

Do not use this setting when posting to docs.guidewire.com. It breaks S3 file
hosting. Leave `trailingSlash` undefined, or set it to `true`.

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
