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
    selectedItemLabel: 'CustomerEngage Quote and Buy',
    items: allSelectors.s641a38c0db32b1509b9fabce309d960f,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-LA/ce-qb/2022.05/es-LA-v.2022.05 CE-QB_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/ce-qb/11.1/es-419-CE_QB-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guía de configuración e instalación de Live Style Guide',
          url: '/l10n/pdfs/es-LA/ce-qb/10.0.1/es-CEQB_LiveStyleGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de la aplicación',
          url: '/l10n/pdfs/es-LA/ce-qb/10.0.1/es-CEQB_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de configuración',
          url: '/l10n/pdfs/es-LA/ce-qb/10.0.1/es-CEQB_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de instalación',
          url: '/l10n/pdfs/es-LA/ce-qb/10.0.1/es-CEQB_InstallGuide-es.pdf',
          videoIcon: false,
        },
        {
          label: 'Guía de seguridad y administración',
          url: '/l10n/pdfs/es-LA/ce-qb/10.0.1/es-CEQB_admin-and-security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ceqb() {
  return <CategoryLayout {...pageConfig} />;
}
