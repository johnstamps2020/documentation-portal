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
          docId: 'in20202rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zH9zTn2rKzM6iUz0',
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20202studiorn',
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
          docId: 'in20202xappdraft',
        },
        {
          label: 'Business Intelligence Getting Started Guide',
          docId: 'in20202bi',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20202csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20202cservicep',
        },
        {
          label: 'Excel Designed Rating',
          docId: 'inexcelrating23',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'AppReader Integration',
          docId: 'in20202appreaderinteg',
        },
        {
          label: 'Business Intelligence Integration',
          docId: 'in20202biinteg',
        },
        {
          label: 'Predictive Analytics Integration',
          docId: 'in20202pa',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Claims Product Configuration Guide',
          docId: 'in20202xclaimsconfigdraft',
        },
        {
          label: 'Core Configuration Guide',
          docId: 'in20202config',
        },
        {
          label: 'Consumer Service Portal Configuration Guide',
          docId: 'in20202xcservicepconfigdraft',
        },
        {
          label: 'Studio Configuration Guide',
          docId: 'in20202studio',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20202xprovportaldraft',
        },
        {
          label: 'Portal Development',
          docId: 'in20202portaldev',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20202prodattref',
        },
        {
          label: 'Underwriting Product Configuration Guide',
          docId: 'in20202xuwconfigdraft',
        },
      ],
    },
  ],
};

export default function LandingPage20202() {
  return <SectionLayout {...pageConfig} />;
}
