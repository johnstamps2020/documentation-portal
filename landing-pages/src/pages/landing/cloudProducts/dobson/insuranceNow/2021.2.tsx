import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Core Release Notes',
          docId: 'in20212rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zIPzgjRufzM6iUz0',
          videoIcon: true
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20212studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp4rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'in20212app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20212csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20212cservicep',
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
          docId: 'in20212appreaderinteg',
        },
        {
          label: 'Business Intelligence Integration',
          docId: 'in20212xbiintegdraft',
        },
        {
          label: 'Live Predict Integration',
          docId: 'in20212pa',
        },
        {
          label: 'API Reference',
          docId: 'in20212apiref',
        },
      ],
    },
    {
      label: 'Development',
      items: [
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
          docId: 'in20212portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration',
          docId: 'in20212config',
        },
        {
          label: 'Billing Configuration Reference',
          docId: 'in20212billref',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20212claimsconfig',
        },
        {
          label: 'Common Functionality Configuration Reference',
          docId: 'in20212commonconfig',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20212xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20212xcservicepconfigdraft',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20212prodattref',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20212provportalinternal',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20212studio',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20212uwconfig',
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
};

export default function LandingPage20212() {
  return <SectionLayout {...pageConfig} />;
}
