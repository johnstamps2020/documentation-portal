import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: undefined,

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de administración',
          url: '/l10n/es-LA/ic/10.0.0/IC10-admin-es.pdf',
        },
        {
          label: 'Guía de las aplicaciones BI',
          url: '/l10n/es-LA/ic/10.0.0/IC10-bi-applications-es.pdf',
        },
        {
          label: 'Guía de configuración de InfoCenter',
          url: '/l10n/es-LA/ic/10.0.0/IC10-config-es.pdf',
        },
        {
          label: 'Guía de Data Specifications',
          url: '/l10n/es-LA/ic/10.0.0/IC10-dataspec-es.pdf',
        },
        {
          label: 'Guía del producto',
          url: '/l10n/es-LA/ic/10.0.0/IC10-product-es.pdf',
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
