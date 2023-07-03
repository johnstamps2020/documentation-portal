import { ExplorationItemProps } from './ExplorationItem';

export const explorationContent: ExplorationItemProps[] = [
  {
    title: 'Theme',
    description: 'Customize the look and feel of your site',
    link: 'docs/Themes/Classic/set-up-theme',
    subItems: [
      {
        title: 'Typescript',
        description: 'Add Typescript to your site',
        link: 'docs/Themes/Classic/theme-typescript',
      },
      {
        title: 'Components',
        description: 'Available components for your site',
        link: 'docs/category/components',
        subItems: [
          {
            title: 'Internal content',
            description: 'Hide Guidewire internal content from external users',
            link: 'docs/Themes/Classic/Components/Internal/internal-content',
          },
          {
            title: 'Internal page',
            description: 'Hide Guidewire an entire page from external users',
            link: 'docs/Themes/Classic/Components/Internal/internal-page',
          },
          {
            title: 'Collapsible',
            description: 'Add a collapsible section to your page',
            link: 'docs/Themes/Classic/Components/collapsible',
          },
          {
            title: 'Right/Wrong images',
            description: 'An image with a tick or cross',
            link: 'docs/Themes/Classic/Components/right-wrong-images',
          },
          {
            title: 'Right/Wrong sections',
            description: 'A section with a tick or cross',
            link: 'docs/Themes/Classic/Components/right-wrong',
          },
        ],
      },
      {
        title: 'Site authors',
        description: 'Add authors to your site',
        link: 'docs/Themes/Classic/site-authors',
      },
    ],
  },
  {
    title: 'Plugin',
    description:
      'This plugin allows you to generate static pages from your OpenAPI spec',
    link: 'docs/Plugins/Redoc/set-up-plugin',
  },
  {
    title: 'Getting started',
    description: 'Learn how to get started with Docusaurus at Guidewire',
    link: 'docs/intro',
  },
  {
    title: 'Migration',
    description: 'Migrate your Docusaurus site to the doc portal',
    link: 'docs/migration-assistance',
  },
];
