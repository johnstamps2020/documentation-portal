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
      label: '2022.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          docId: 'isbc202205appdeDE',
        },
        {
          label: 'Konfigurationshandbuch',
          docId: 'isbc202205configdeDE',
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          docId: 'is202205contactdeDE',
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Cloud-API-Geschäftsabläufe- und Konfigurationshandbuch',
          docId: 'isbc202111apibfdeDE',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/bc/2020.05/ISCL_202005_de_BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/bc/2020.05/ISCL_202005_de_BC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/bc/10.1.1/BC1011_de-DE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/bc/10.1.1/BC1011_de-DE_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/bc/10.0.2/de-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/bc/10.0.2/de-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/de-DE/bc/10.0.2/de-BC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/bc/10.0.0/de-BC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/bc/10.0.0/de-BC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Bc() {
  return <CategoryLayout {...pageConfig} />;
}
