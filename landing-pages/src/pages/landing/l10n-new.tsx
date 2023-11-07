import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { implementationResourcesSidebar } from './common/sidebars';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  items: [
    {
      label: 'Deutsch',
      pagePath: 'l10n-new/de-DE',
    },
    {
      label: 'Español',
      pagePath: 'l10n-new/es-419',
    },
    {
      label: 'Español (España)',
      pagePath: 'l10n-new/es-ES',
    },
    {
      label: 'Français',
      pagePath: 'l10n-new/fr-FR',
    },
    {
      label: 'Italiano',
      pagePath: 'l10n-new/it-IT',
    },
    {
      label: '日本語',
      pagePath: 'l10n-new/ja-JP',
    },
    {
      label: 'Nederlands',
      pagePath: 'l10n-new/nl-NL',
    },
    {
      label: 'Português',
      pagePath: 'l10n-new/pt-BR',
    },
  ],
  sidebar: implementationResourcesSidebar,
};

export default function L10nnew() {
  return <ProductFamilyLayout {...pageConfig} />;
}
