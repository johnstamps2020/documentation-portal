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
          label: 'Release Notes',
          docId: 'ispc202111releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc202111newandchanged',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrndobson',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools460',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools Compatibility',
          docId: 'isupgradecompatibility',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'ispc202111devsetup',
        },
        {
          label: 'Upgrade',
          docId: 'ispc202111upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc202111app',
        },
        {
          label: 'Contact Management',
          docId: 'is202111contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc202111admin',
        },
        {
          label: 'Data Archiving',
          docId: 'ispc202111dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202111apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202111config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202111global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc202111rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202111pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202111pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202111integoverview',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'ispc202111apica',
        },
        {
          label: 'Cloud API Business Flows and Configuration',
          docId: 'ispc202111apibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'ispc202111apicm',
        },
        {
          label: 'Cloud API Reference',
          docId: 'pcapirefdobson',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'ispc202111integ',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202111restapifw',
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
        {
          label: 'GUnit Testing',
          docId: 'ispc202111testing',
        },
        {
          label: 'API Testing (GT: API)',
          docId: 'testingframeworksapidobson',
        },
        {
          label: 'User Interface Testing (GT: UI)',
          docId: 'testingframeworksuidobson',
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
    label: 'Select cloud release',
    selectedItemLabel: 'Dobson (2021.11)',
    items: [
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/policyCenterCloud',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/policyCenterCloud/pcGwCloud/2020.11',
      },
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/policyCenterCloud/pcGwCloud/2021.04',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/pcGwCloud/2021.11',
      },
      {
        label: 'Elysian (2022.05)',
        pagePath: 'cloudProducts/elysian/pcGwCloud/2022.05',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/pcGwCloud/2022.09',
      },
      {
        label: 'Garmisch (2023.02)',
        pagePath: 'cloudProducts/garmisch/pcGwCloud/2023.02',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202111() {
  return <SectionLayout {...pageConfig} />;
}
