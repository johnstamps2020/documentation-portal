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
          docId: 'in20211rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zIYz11mVjxzM6iUz0',
          videoIcon: true
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20211studiorn',
        },
        {
          label: 'Consumer Service Portal 2021.1 Release Notes',
          docId: 'incsp20211rn',
        },
        {
          label: 'Consumer Service Portal 3.26 Release Notes',
          docId: 'incsp326rn',
        },
        {
          label: 'Consumer Service Portal 3.25 Release Notes',
          docId: 'incsp325rn',
        },
        {
          label: 'Consumer Service Portal 3.24 Release Notes',
          docId: 'incsp324rn',
        },
        {
          label: 'Consumer Service Portal 3.23 Release Notes',
          docId: 'incsp323rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'in20211app',
        },
        {
          label: 'Business Intelligence Getting Started Guide',
          docId: 'in20211bi',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20211csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20211cservicep',
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
          docId: 'in20211appreaderinteg',
        },
        {
          label: 'Business Intelligence Integration',
          docId: 'in20211xbiintegdraft',
        },
        {
          label: 'Predictive Analytics Integration',
          docId: 'in20211pa',
        },
        {
          label: 'API Reference',
          docId: 'in20211apiref',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Consumer Service Portal Configuration Guide',
          docId: 'in20211xcservicepconfigdraft',
        },
        {
          label: 'Core Configuration Guide',
          docId: 'in20211config',
        },
        {
          label: 'Common Functionality Configuration Reference',
          docId: 'in20211xcommonconfigdraft',
        },
        {
          label: 'Studio Configuration Guide',
          docId: 'in20211studio',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20211xprovportaldraft',
        },
        {
          label: 'Portal Development Guide',
          docId: 'in20211portaldev',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20211prodattref',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20211uwconfig',
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
          label: 'Developer Setup',
          docId: 'indevguidejava11draft',
        },
        {
          label: 'Developers Setup',
          docId: 'indevguidejava11ext',
        },
        {
          label: 'Upgrade Tools',
          docId: 'inupgradetoolsdraft',
        },
      ],
    },
  ],
};

export default function LandingPage20211() {
  return <SectionLayout {...pageConfig} />;
}
