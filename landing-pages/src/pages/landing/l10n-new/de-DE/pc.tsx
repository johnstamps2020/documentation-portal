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
          docId: 'ispc202205appdeDE',
        },
        {
          label: 'Konfigurationshandbuch',
          docId: 'ispc202205configdeDE',
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
          label: 'Cloud-API-Authentifizierungshandbuch',
          docId: 'ispc202111apicadeDE',
        },
        {
          label: 'Cloud-API-Geschäftsabläufe- und Konfigurationshandbuch',
          docId: 'ispc202111apibfdeDE',
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Advanced Product Designer-Handbuch',
          url: '/l10n/de-DE/pc/2020.11/PC_CL202011_de-DE_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/2020.05/ISCL_202005_de_PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/2020.05/ISCL_202005_de_PC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Advanced Product Designer-Handbuch',
          url: '/l10n/de-DE/pc/10.1.1/PC1011_de-DE_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/10.1.1/PC1011_de-DE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/10.1.1/PC1011_de-DE_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Systemadministrationshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'InsuranceSuite-Handbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-InsuranceSuiteGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Product-Designer-Handbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ProductDesignerGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Produktmodellhandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ProductModelGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-RulesGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
