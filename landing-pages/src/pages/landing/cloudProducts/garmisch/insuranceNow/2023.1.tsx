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
          docId: 'in20231rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/INFlaine',
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20231studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20231rn',
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
          docId: 'in20231app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20231csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20231cservicep',
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
          docId: 'in20231appreaderinteg',
        },
        {
          label: 'Business Intelligence Integration',
          docId: 'in20231xbiintegdraft',
        },
        {
          label: 'API Reference',
          docId: 'in20231apiref',
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
          docId: 'in20231portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Billing Configuration Reference',
          docId: 'in20231billref',
        },
        {
          label: 'Core Configuration',
          docId: 'in20231config',
        },
        {
          label: 'Common Functionality Configuration Reference',
          docId: 'in20231commonconfig',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20231xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20231xcservicepconfigdraft',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20231claimsconfig',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20231studio',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20231prodattref',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20231provportal',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20231provportalinternal',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20231uwconfig',
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

export default function LandingPage20231() {
  return <SectionLayout {...pageConfig} />;
}
