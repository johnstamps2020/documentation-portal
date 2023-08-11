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
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/InsuranceNowGarmisch',
          videoIcon: true,
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
          label: 'Business Intelligence Integration',
          docId: 'in20232xbiintegdraft',
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
          label: 'Developer Setup',
          docId: 'indevguidejava11draft',
        },
        {
          label: 'Developer Setup',
          docId: 'indevguidejava11ext',
        },
        {
          label: 'GWCP Operations for Self-led Customers',
          docId: 'ingwcpops',
        },
        {
          label: 'Portal Development',
          docId: 'in20232portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Billing Configuration Reference',
          docId: 'in20232billref',
        },
        {
          label: 'Core Configuration',
          docId: 'in20232config',
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
          label: 'Claims Configuration Reference',
          docId: 'in20232claimsconfig',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20232studio',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20232prodattref',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20232provportal',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20232provportalinternal',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20232uwconfig',
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
    items: allSelectors.sb93ea0f8d0fc172dd24c8ce25d379ff9,
    labelColor: 'black',
  },
};

export default function LandingPage20232() {
  return <SectionLayout {...pageConfig} />;
}
