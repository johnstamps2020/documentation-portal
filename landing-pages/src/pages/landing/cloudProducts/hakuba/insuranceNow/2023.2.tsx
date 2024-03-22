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
          docId: 'in20232rn',
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20232studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20232rn',
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
          docId: 'in20232app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20232csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20232cservicep',
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
          docId: 'in20232appreaderinteg',
        },
        {
          label: 'API Reference',
          docId: 'in20232apiref',
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
          docId: 'in20232portaldev',
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
          docId: 'in20232config',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20232studio',
        },
        {
          label: 'Billing Configuration Reference',
          docId: 'in20232billref',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20232claimsconfig',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20232uwconfig',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20232prodattref',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20232xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20232xcservicepconfigdraft',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20232provportal',
        },
        {
          label: 'Provisioning Portal - Internal',
          docId: 'in20232provportalinternal',
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
    selectedItemLabel: 'Hakuba (2023.2)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20232() {
  return <SectionLayout {...pageConfig} />;
}
