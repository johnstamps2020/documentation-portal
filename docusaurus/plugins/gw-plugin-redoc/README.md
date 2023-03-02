# gw-plugin-redoc

Generates Redoc pages for your site.

## Setup

Set your access to the @doctools scope in Artifactory: see the main README in
this repo

## Install

```
yarn add @doctools/gw-plugin-redoc@<version here>
```

Look up the version latest version in `package.json` or in Artifactory.

## Configuration

1. Add the plugin to your `docusaurus.config.js`.

   ```js
   const path =  require('path');

   // . . .

   plugins: [
     [
       "@doctools/gw-plugin-redoc",
       {
         configPath: path.resolve(__dirname, "gw.plugin.redoc.config.js"),
       },
     ],
   ],
   ```

1. Create a `gw.plugin.redoc.config.js` file.

   ```js
   const path = require('path');

   /** @type {import('@doctools/gw-plugin-redoc/lib/scripts/buildPages').GuidewireRedocPluginProps} */
   const config = {
     specSourceDir: path.resolve(__dirname, 'openapi'),
     docsDir: path.resolve(__dirname, 'docs'),
     staticDir: path.resolve(__dirname, 'static'),
     specList: [
       {
         title: 'APD API definitions',
         task: 'generate-from-spec',
         src: 'apd-openapi.json',
       },
     ],
   };

   module.exports = config;
   ```

1. Run the following command:

   ```
   yarn docusaurus redoc-generate-pages
   ```
