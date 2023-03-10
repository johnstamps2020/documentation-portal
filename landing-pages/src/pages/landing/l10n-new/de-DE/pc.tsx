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
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/2020.05/ISCL_202005_de_PC-AppGuide.pdf',
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/2020.05/ISCL_202005_de_PC_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Advanced Product Designer-Handbuch',
          url: '/l10n/de-DE/pc/10.1.1/PC1011_de-DE_AdvancedProductDesigner.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/10.1.1/PC1011_de-DE_AppGuide.pdf',
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/10.1.1/PC1011_de-DE_ContactMgmtGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-AppGuide.pdf',
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-ConfigGuide.pdf',
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/de-DE/pc/10.0.2/de-PC-RulesGuide.pdf',
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Systemadministrationshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-AdminGuide.pdf',
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-AppGuide.pdf',
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ConfigGuide.pdf',
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ContactMgmtGuide.pdf',
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-InstallGuide.pdf',
        },
        {
          label: 'InsuranceSuite-Handbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-InsuranceSuiteGuide.pdf',
        },
        {
          label: 'Product-Designer-Handbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ProductDesignerGuide.pdf',
        },
        {
          label: 'Produktmodellhandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-ProductModelGuide.pdf',
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/de-DE/pc/10.0.0/de-PC-RulesGuide.pdf',
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}
