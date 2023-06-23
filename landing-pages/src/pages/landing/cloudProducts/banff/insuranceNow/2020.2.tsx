import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

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
          docId: 'in20202rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zH9zTn2rKzM6iUz0',
          videoIcon: true,
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
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Banff (2020.2)',
    items: [
      {
        label: 'Aspen (2020.1)',
        pagePath: 'cloudProducts/aspen/insuranceNow/2020.1',
      },
      {
        label: 'Banff (2020.2)',
        pagePath: 'cloudProducts/banff/insuranceNow/2020.2',
      },
      {
        label: 'Cortina (2021.1)',
        pagePath: 'cloudProducts/cortina/insuranceNow/2021.1',
      },
      {
        label: 'Dobson (2021.2)',
        pagePath: 'cloudProducts/dobson/insuranceNow/2021.2',
      },
      {
        label: 'Elysian (2022.1)',
        pagePath: 'cloudProducts/elysian/insuranceNow/2022.1',
      },
      {
        label: 'Flaine (2022.2)',
        pagePath: 'cloudProducts/flaine/insuranceNow/2022.2',
      },
      {
        label: 'Garmisch (2023.1)',
        pagePath: 'cloudProducts/garmisch/insuranceNow/2023.1',
      },
      {
        label: 'Hakuba (2023.2)',
        pagePath: 'cloudProducts/hakuba/insuranceNow/2023.2',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage20202() {
  return <SectionLayout {...pageConfig} />;
}
