---
sidebar_position: 1
---

# Getting started

Deploying to docs.guidewire.com makes sense if you want an external-facing site.

Want to publish internal docs? Look at
[deploying to Atmos](./deploy-to-atmos.md) without using a Guidewire theme. You
can still use the Redoc plugin.

## Create a new Docusaurus site

[Follow the instructions on the official Docusaurus site](https://docusaurus.io/docs/installation).

## Upgrade to Yarn 3

Use Yarn 3 in builds for docs.guidewire.com.

1. Upgrade your site to Yarn 3.
1. At the root of your site, set up `yarnrc.yml` similar to the following

```yml
yarnPath: .yarn/releases/yarn-3.3.0.cjs
nodeLinker: node-modules
npmAlwaysAuth: true
npmAuthToken: ${NPM_AUTH_TOKEN}
npmScopes:
  doctools:
    npmRegistryServer: https://artifactory.guidewire.com/artifactory/api/npm/doctools-npm-dev/
```

## Setup access to the @doctools scope in Artifactory (first time only)

import Artifactory from './\_set-up-artifactory.md';

<Artifactory/>

## Add Guidewire theme/plugin

- [See set up instructions for the theme](./Themes/Classic/set-up-theme.mdx).
- [See set up instructions for the plugin](./Plugins/Redoc/set-up-plugin.mdx).

## Configure deployment

Get in touch with doctools@guidewire.com and they can provide assistance.
