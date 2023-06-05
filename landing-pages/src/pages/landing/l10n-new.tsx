import ProductFamilyLayout, {
  ProductFamilyLayoutProps,
} from 'components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: ProductFamilyLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  items: [
    {
      label: 'Deutsch',
      pagePath: 'l10n-new/de-DE',
    },
    {
      label: 'Español (España)',
      pagePath: 'l10n-new/es-ES',
    },
    {
      label: 'Español',
      pagePath: 'l10n-new/es-LA',
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
  releaseSelector: false,
};

export default function L10nnew() {
  return <ProductFamilyLayout {...pageConfig} />;
}
