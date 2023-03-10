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
          label: 'Release Notes',
          docId: 'ispc202205releasenotes',
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'ispc202205devsetup',
        },
        {
          label: 'Upgrade',
          docId: 'ispc202205upgrade',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools450',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools Compatibility',
          docId: 'isupgradecompatibility',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc202205app',
        },
        {
          label: 'Contact Management',
          docId: 'is202205contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc202205admin',
        },
        {
          label: 'Data Archiving',
          docId: 'ispc202205dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202205apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202205config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202205global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc202205rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202205pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202205pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202205integoverview',
        },
        {
          label: 'API Reference',
          docId: 'pcapirefelysian',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'ispc202205apica',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'ispc202205apibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'ispc202205apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Pre-built Integrations, and SOAP APIs',
          docId: 'ispc202205integ',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202205restapifw',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Gosu Reference',
          docId: 'gosureflatest',
        },
      ],
    },
    {
      label: 'Glossary',
      items: [
        {
          label: 'Glossary',
          docId: 'gwglossary',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: 'Elysian (2022.05)',
    items: [
      {
        label: 'Elysian (2022.05)',
        pagePath: '',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/pcGwCloud/2022.09',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/pcGwCloud/2021.11',
      },
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/policyCenterCloud/pcGwCloud/2021.04',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/policyCenterCloud/pcGwCloud/2020.11',
      },
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/policyCenterCloud',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202205() {
  return <SectionLayout {...pageConfig} />;
}
