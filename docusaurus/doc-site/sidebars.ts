import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { filterSidebarsByAccess } from '@doctools/docusaurus-security';
import { resolve } from 'path';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'deploy-to-atmos',
    'migration-assistance',
    {
      Plugins: [
        { Redoc: ['Plugins/Redoc/set-up-plugin'] },
        {
          Security: [
            'Plugins/Security/set-up-plugin-security',
            'Plugins/Security/public-pages',
            'Plugins/Security/restricted-pages',
          ],
        },
        'Plugins/image-zoom',
      ],
    },
    {
      Themes: [
        {
          Classic: [
            'Themes/Classic/set-up-theme',
            'Themes/Classic/theme-typescript',
            {
              Components: [
                {
                  Internal: [
                    'Themes/Classic/Components/Internal/internal-content',
                    'Themes/Classic/Components/Internal/internal-page',
                  ],
                },
                'Themes/Classic/Components/collapsible',
                'Themes/Classic/Components/right-wrong-images',
                'Themes/Classic/Components/right-wrong',
              ],
            },
            'Themes/Classic/site-authors',
          ],
        },
      ],
    },
  ],
};

const filteredSidebars = filterSidebarsByAccess(
  sidebars,
  resolve(__dirname, 'docs')
);

export default filteredSidebars;
