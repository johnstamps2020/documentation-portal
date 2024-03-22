import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Core Release Notes',
          docId: 'in20233rn',
        },
        {
          label: 'Release Video',
          url: 'https://youtu.be/mss398Z1vY4',
          videoIcon: true,
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20233studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20233rn',
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'in20233app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20233csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20233cservicep',
        },
        {
          label: 'Excel Designed Rating',
          docId: 'inexcelrating30',
        },
        {
          label: 'Data Service',
          docId: 'indataservice',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'AppReader Integration',
          docId: 'in20233appreaderinteg',
        },
        {
          label: 'API Reference',
          docId: 'in20233apiref',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'API Modernization',
          docId: 'inapimodernization',
        },
        {
          label: 'Custom API Development',
          docId: 'inapidevelopment',
        },
        {
          label: 'Developer Setup - Internal',
          docId: 'indevguidejava11draft',
        },
        {
          label: 'Developer Setup',
          docId: 'indevguidejava11ext',
        },
        {
          label: 'GWCP Operations for InsuranceNow',
          docId: 'ingwcpops',
        },
        {
          label: 'Portal Development',
          docId: 'in20233portaldev',
        },
        {
          label: 'Programming Standards',
          docId: 'inprogstandards',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration',
          docId: 'in20233config',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20233studio',
        },
        {
          label: 'Billing Configuration Reference',
          docId: 'in20233billref',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20233claimsconfig',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20233uwconfig',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20233prodattref',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20233xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20233xcservicepconfigdraft',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20233provportal',
        },
        {
          label: 'Provisioning Portal - Internal',
          docId: 'in20233provportalinternal',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Install Assist',
          docId: 'ininstallassistdraft',
        },
        {
          label: 'Upgrade Tools',
          docId: 'inupgradetoolsdraft',
        },
      ],
    },
  ],
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck (2023.3)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20233() {
  return <SectionLayout {...pageConfig} />;
}
