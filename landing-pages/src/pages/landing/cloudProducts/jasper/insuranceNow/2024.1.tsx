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
          docId: 'in20241rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/InsuranceNowInnsbruck',
          videoIcon: true,
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20241studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20241rn',
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
          docId: 'in20241app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20241csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20241cservicep',
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
          docId: 'in20241appreaderinteg',
        },
        {
          label: 'Business Intelligence Integration',
          docId: 'in20241xbiintegdraft',
        },
        {
          label: 'API Reference',
          docId: 'in20241apiref',
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
          docId: 'in20241portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration',
          docId: 'in20241config',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20241studio',
        },
        {
          label: 'Billing Configuration Reference',
          docId: 'in20241billref',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20241claimsconfig',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20241uwconfig',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20241prodattref',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20241xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20241xcservicepconfigdraft',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20241provportal',
        },
        {
          label: 'Provisioning Portal - Internal',
          docId: 'in20241provportalinternal',
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
    selectedItemLabel: 'Jasper (2024.1)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20241() {
  return <SectionLayout {...pageConfig} />;
}
