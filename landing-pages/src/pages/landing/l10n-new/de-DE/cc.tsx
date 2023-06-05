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
          docId: 'iscc202205appdeDE',
        },
        {
          label: 'Konfigurationshandbuch',
          docId: 'iscc202205configdeDE',
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
          docId: 'iscc202111apibfdeDE',
        },
        {
          label: 'Cloud-API-Authentifizierungshandbuch',
          docId: 'iscc202111apicadeDE',
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/cc/2020.05/ISCL_202005_de_CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/cc/2020.05/ISCL_202005_de_CC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/cc/10.1.1/CC1011_de-DE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/cc/10.1.1/CC1011_de-DE_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/cc/10.0.2/de-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/cc/10.0.2/de-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/de-DE/cc/10.0.2/de-CC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/cc/10.0.0/de-CC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/cc/10.0.0/de-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
