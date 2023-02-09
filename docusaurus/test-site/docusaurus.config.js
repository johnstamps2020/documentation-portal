const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const path = require("path");
const siteTitle = "Guidewire Docusaurus Test Site";

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: siteTitle,
    tagline: "Dinosaurs are cool",
    url: "https://your-docusaurus-test-site.com",
    baseUrl: process.env["BASE_URL"] || "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "throw",
    favicon: "img/favicon.ico",
    organizationName: "facebook", // Usually your GitHub org/user name.
    projectName: "docusaurus", // Usually your repo name.
    i18n: {
      defaultLocale: "en",
      locales: ["en", "pl"],
    },

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            routeBasePath: "/",
            editUrl: function ({ versionDocsDirPath, docPath }) {
              return `https://stash.guidewire.com/projects/DOCTOOLS/repos/docusaurus-guidewire/browse/test-site/${versionDocsDirPath}/${docPath}`;
            },
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: siteTitle,
          logo: {
            alt: "Test Site Logo",
            src: "img/logo.svg",
            href: "jim/is/not/slim",
          },
          items: [
            {
              label: "Playground",
              to: "playground",
            },
            {
              type: "localeDropdown",
              position: "right",
            },
          ],
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),

    plugins: [
      [
        "../plugins/gw-plugin-redoc/src",
        {
          configPath: path.resolve(__dirname, "gw.plugin.redoc.config.js"),
        },
      ],
    ],

    themes: ["@doctools/gw-theme-classic"],
  }
);
