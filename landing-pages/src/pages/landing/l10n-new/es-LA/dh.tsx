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

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guía de administración',
          url: '/l10n/es-LA/dh/10.0.0/DH10-admin-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración de DataHub',
          url: '/l10n/es-LA/dh/10.0.0/DH10-config-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de Data Specifications',
          url: '/l10n/es-LA/dh/10.0.0/DH10-dataspec-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/es-LA/dh/10.0.0/DH10-install-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía del producto',
          url: '/l10n/es-LA/dh/10.0.0/DH10-product-es.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Dh() {
  return <CategoryLayout {...pageConfig} />;
}
