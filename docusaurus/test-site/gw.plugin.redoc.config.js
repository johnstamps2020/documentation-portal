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
    // {
    //   title: "Admin API",
    //   task: "generate-from-spec",
    //   src: "cc/cc-admin.json",
    // },
    // {
    //   title: "Claim API",
    //   task: "generate-from-spec",
    //   src: "cc/cc-claim.json",
    // },
    // {
    //   title: "Common API",
    //   task: "generate-from-spec",
    //   src: "cc/cc-common.json",
    // },
    // {
    //   title: "Composite API",
    //   task: "generate-from-spec",
    //   src: "cc/cc-composite.json",
    // },
    // {
    //   title: "APD API definitions",
    //   task: "generate-from-spec",
    //   src: "apd-openapi.json",
    // },
    // {
    //   title: "InsuranceNow API",
    //   task: "generate-from-spec",
    //   taskOptions: {
    //     group: "by-tag",
    //     removeSecurityNode: true,
    //     purgeExpression: (key) => key.startsWith("x-"),
    //   },
    //   src: "api-spec-core_v5-unsorted.yaml",
    // },
    // {
    //   title: "Account API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.0-pc-account-v1-openapi.json",
    // },
    // {
    //   title: "Admin API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.0-pc-admin-v1-openapi.json",
    // },
    // {
    //   title: "Common API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.0-pc-common-v1-openapi.json",
    // },
    // {
    //   title: "Composite API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.0-pc-composite-v1-openapi.json",
    // },
    // {
    //   title: "Job API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.0-pc-job-v1-openapi.json",
    // },
    // {
    //   title: "Policy API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.0-pc-policy-v1-openapi.json",
    // },
    // {
    //   title: "Product Definition API",
    //   task: "generate-from-spec",
    //   src: "pc/is-50.3.1-pc-productdefinition-v1-openapi.json",
    // },
    // {
    //   title: "Example: Job API with LOB",
    //   task: "generate-from-spec",
    //   src: "pc/example-job-personal-auto-line.json",
    // },
    // {
    //   title: "Example: Policy API with LOB",
    //   task: "generate-from-spec",
    //   src: "pc/example-policy-personal-auto-line.json",
    // },
    // {
    //   title: "Webhooks API", // Becomes the name of the folder
    //   task: "generate-from-spec", // the only allowed value is `generate-from-spec`
    //   taskOptions: {
    //     //group: "by-tag",
    //     removeSecurityNode: true, // removes the `security` field from the spec
    //     deletePath: (path) => path.startsWith("/internal/"),
    //   },
    //   src: "web-hooks/api.yml", // path to the spec file, relative to `specSourceDir`, can by .json or .yaml
    // },
    // {
    //   title: 'CICD Manager API test', // Becomes the name of the folder
    //   task: 'generate-from-spec', // the only allowed value is `generate-from-spec`
    //   taskOptions: {
    //     group: 'by-tag', // groups the pages by tag
    //     removeSecurityNode: true, // removes the `security` field from the spec
    //     purgeExpression: (key) => key.startsWith('x-'), // if this function matches a prop name, the prop is purged from the schema
    //     deletePath: (path) => path.startsWith('/internal/'), // if this function returns true, the path is not included in the output
    //   },
    //   src: 'cicd-manager.json', // path to the spec file, relative to `specSourceDir`, can by .json or .yaml
    // },
    // {
    //   title: 'Admin API',
    //   task: 'generate-from-spec',
    //   src: 'bc/bc-admin.json',
    // },
  ],
};

module.exports = config;
