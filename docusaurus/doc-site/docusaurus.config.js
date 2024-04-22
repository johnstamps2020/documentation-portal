// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Docusaurus Guidewire',
  tagline: 'Your one-stop shop for docs',
  url: 'https://docs.guidewire.com',
  baseUrl: process.env['BASE_URL'] || '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal/browse/docusaurus/doc-site`,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Docusaurus Guidewire',
      },
      prism: {
        theme: require('prism-react-renderer').themes.vsDark,
        draculaTheme: require('prism-react-renderer').themes.dracula,
        additionalLanguages: ['yaml'],
      },
      zoom: {
        selector: '.markdown img:not(.doNotZoom)',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      },
    }),

  themes: ['@doctools/gw-theme-classic', '@docusaurus/theme-live-codeblock'],
  plugins: [
    require.resolve('docusaurus-plugin-image-zoom'),
    '@doctools/docusaurus-security',
  ],
};

module.exports = config;
