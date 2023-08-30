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
    label: 'Choisissez un produit',
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.02',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/pdfs/fr-FR/pe/2023.02/ProducerEngage_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: "Guide de l'application",
          url: '/l10n/pdfs/fr-FR/pe/2021.11/fr-FR Digital v.2021.11 PE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.4.1',
      items: [
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/pdfs/fr-FR/pe/11.4.1/fr-FR-Digital v.11.4.1 PE admin&security-guide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide de l'application",
          url: '/l10n/pdfs/fr-FR/pe/11.4.1/fr-FR Digital v.11.4.1 PE AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/pe/11.4.1/fr-FR-Digital v.11.4.1 PE InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide du développeur',
          url: '/l10n/pdfs/fr-FR/pe/11.4.1/fr-FR-Digital v.11.4.1 PE-DevelopersGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/pe/11.1/fr-PE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/pe/11.1/fr-PE-cloud_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guide des applications',
          url: '/l10n/pdfs/fr-FR/pe/10.0.1/fr-PE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guide de configuration',
          url: '/l10n/pdfs/fr-FR/pe/10.0.1/fr-PE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation et de configuration Live Style Guide",
          url: '/l10n/pdfs/fr-FR/pe/10.0.1/fr-PE_Life Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'installation",
          url: '/l10n/pdfs/fr-FR/pe/10.0.1/fr-PE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: "Guide d'administration et de sécurité",
          url: '/l10n/pdfs/fr-FR/pe/10.0.1/fr-PE_admin-and-security-guide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
