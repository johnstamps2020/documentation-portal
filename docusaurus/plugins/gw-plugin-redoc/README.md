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

   module.exports = {
     specSourceDir: path.resolve(__dirname, 'openapi'),
     docsDir: path.resolve(__dirname, 'docs'),
     staticDir: path.resolve(__dirname, 'static'),
     specList: [
       {
         title: 'InsuranceNow API', // Becomes the name of the folder
         task: 'generate-from-spec', // the only allowed value is `generate-from-spec`
         taskOptions: {
           group: 'by-tag', // Groups the pages by tag. Grouping is done only if the spec file has the tags property at the root level.
           removeSecurityNode: true, // removes the `security` field from the spec
           purgeExpression: (key) => key.startsWith('x-'), // if this function matches a prop name, the prop is purged from the schema
           deletePath: (path) => path.startsWith('/internal/'), // if this function returns true, the path is not included in the output
         },
         src: 'api-spec-core_v5-unsorted.yaml', // path to the spec file, relative to `specSourceDir`, can by .json or .yaml
       },
     ],
   };
   ```

1. Run the following command:

   ```
   yarn docusaurus redoc-generate-pages
   ```
