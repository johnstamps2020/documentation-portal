import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Seleccionar producto',
    selectedItemLabel: 'VendorEngage',
    items: allSelectors.s641a38c0db32b1509b9fabce309d960f,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-LA/ve/2022.05/es-LA v.2022.05 VE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/ve/11.1/es-419-VE-onprem-InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de seguridad y administración',
          url: '/l10n/pdfs/es-LA/ve/10.0.1/es-VE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-LA/ve/10.0.1/es-VE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/ve/10.0.1/es-VE_InstallGuide-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración e instalación de Live Style Guide',
          url: '/l10n/pdfs/es-LA/ve/10.0.1/es-VE_LiveStyleGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ve() {
  return <CategoryLayout {...pageConfig} />;
}
