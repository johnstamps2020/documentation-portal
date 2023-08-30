import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  items: [
    {
      label: 'Deutsch',
      pagePath: 'l10n/de-DE',
    },
    {
      label: 'Español (España)',
      pagePath: 'l10n/es-ES',
    },
    {
      label: 'Español',
      pagePath: 'l10n/es-LA',
    },
    {
      label: 'Français',
      pagePath: 'l10n/fr-FR',
    },
    {
      label: 'Italiano',
      pagePath: 'l10n/it-IT',
    },
    {
      label: '日本語',
      pagePath: 'l10n/ja-JP',
    },
    {
      label: 'Nederlands',
      pagePath: 'l10n/nl-NL',
    },
    {
      label: 'Português',
      pagePath: 'l10n/pt-BR',
    },
  ],
  sidebar: {
    label: 'Implementation Resources',
    items: [
      {
        label: 'Community Case Templates',
        docId: 'cloudtickettemplates',
      },
      {
        label: 'Product Adoption',
        docId: 'surepathmethodologymain',
      },
      {
        label: 'Cloud Standards',
        docId: 'standardslatest',
      },
      {
        label: 'Upgrade Diff Reports',
        pagePath: 'upgradediffs',
      },
      {
        label: 'Internal docs',
        docId: 'internaldocslatest',
      },
    ],
  },
};

export default function L10n() {
  return <ProductFamilyLayout {...pageConfig} />;
}
