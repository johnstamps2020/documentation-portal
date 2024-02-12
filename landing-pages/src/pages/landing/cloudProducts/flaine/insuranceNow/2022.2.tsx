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
          docId: 'in20222rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/INFlaine',
          videoIcon: true,
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20222studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20222rn',
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
          docId: 'in20222app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20222csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20222cservicep',
        },
        {
          label: 'Excel Designed Rating',
          docId: 'inexcelrating30',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'AppReader Integration',
          docId: 'in20222appreaderinteg',
        },
        {
          label: 'API Reference',
          docId: 'in20222apiref',
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
          docId: 'in20222portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration',
          docId: 'in20222config',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20222studio',
        },
        {
          label: 'Billing Configuration Reference',
          docId: 'in20222billref',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20222claimsconfig',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20222uwconfig',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20222prodattref',
        },
        {
          label: 'Common Functionality Configuration Reference',
          docId: 'in20222commonconfig',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20222xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20222xcservicepconfigdraft',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20222provportal',
        },
        {
          label: 'Provisioning Portal - Internal',
          docId: 'in20222provportalinternal',
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
    selectedItemLabel: 'Flaine (2022.2)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20222() {
  return <SectionLayout {...pageConfig} />;
}
