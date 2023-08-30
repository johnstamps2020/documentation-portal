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
    label: 'Produkt auswählen',
    selectedItemLabel: 'PolicyCenter',
    items: allSelectors.sabc928e21c4c1dfb2a841b6b2331c9db,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2022.05',
      items: [
        {
          label: 'Handbuch Advanced Product Designer für PolicyCenter',
          url: '/l10n/pdfs/de-DE/pc/2022.05/AdvancedProductDesigner-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/2022.05/PC-ConfigGuide-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/2022.05/PC-AppGuide-DE.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2021.11',
      items: [
        {
          label: 'Cloud-API-Geschäftsabläufe- und Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/2021.11/PC v.2021.11  de-DE CloudAPIGuide-BusinessFlows.pdf',
          videoIcon: false,
        },
        {
          label: 'Cloud-API-Authentifizierungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/2021.11/PC v.2021.11  de-DE CloudAPIGuide-Auth.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.11',
      items: [
        {
          label: 'Advanced Product Designer-Handbuch',
          url: '/l10n/pdfs/de-DE/pc/2020.11/PC_CL202011_de-DE_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '2020.05',
      items: [
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/pc/2020.05/ISCL_202005_de_PC_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/2020.05/ISCL_202005_de_PC-AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.2.0',
      items: [
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.2.0/PC-InstallGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.2.0/PC-ContactMgmtGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'German Documentation (de-DE) Release Notes',
          url: '/l10n/pdfs/de-DE/pc/10.2.0/ReleaseNotes-10.2.0-docs-de.pdf',
          videoIcon: false,
        },
        {
          label: 'Advanced Product Designer-Handbuch',
          url: '/l10n/pdfs/de-DE/pc/10.2.0/AdvancedProductDesigner_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.2.0/PC-ConfigGuide_de-DE.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.2.0/PC-AppGuide_de-DE.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.1.1',
      items: [
        {
          label: 'Advanced Product Designer-Handbuch',
          url: '/l10n/pdfs/de-DE/pc/10.1.1/PC1011_de-DE_AdvancedProductDesigner.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.1.1/PC1011_de-DE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.1.1/PC1011_de-DE_ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.2',
      items: [
        {
          label: 'Regelhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.2/de-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.2/de-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.2/de-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire-Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.2/de-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.0',
      items: [
        {
          label: 'Product-Designer-Handbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-ProductDesignerGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Regelhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-RulesGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Konfigurationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-ConfigGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Systemadministrationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-AdminGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'InsuranceSuite-Handbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-InsuranceSuiteGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Anwendungshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Produktmodellhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-ProductModelGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Installationshandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Kontaktmanagementhandbuch',
          url: '/l10n/pdfs/de-DE/pc/10.0.0/de-PC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Pc() {
  return <CategoryLayout {...pageConfig} />;
}