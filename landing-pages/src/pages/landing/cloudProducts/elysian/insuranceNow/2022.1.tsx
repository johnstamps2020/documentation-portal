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
          docId: 'in20221rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zGCzZHe5LzcT3Fz0',
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20221studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20221rn',
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
          docId: 'in20221app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20221csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20221cservicep',
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
          docId: 'in20221appreaderinteg',
        },
        {
          label: 'Business Intelligence Integration',
          docId: 'in20221xbiintegdraft',
        },
        {
          label: 'Guidewire Predict Integration',
          docId: 'in20221pa',
        },
        {
          label: 'API Reference',
          docId: 'in20221apiref',
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
          docId: 'in20221portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Billing Configuration Reference',
          docId: 'in20221billref',
        },
        {
          label: 'Core Configuration',
          docId: 'in20221config',
        },
        {
          label: 'Common Functionality Configuration Reference',
          docId: 'in20221commonconfig',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20221xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20221xcservicepconfigdraft',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20221claimsconfig',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20221studio',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20221prodattref',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20221provportal',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20221provportalinternal',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20221uwconfig',
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

export default function LandingPage20221() {
  return <SectionLayout {...pageConfig} />;
}
