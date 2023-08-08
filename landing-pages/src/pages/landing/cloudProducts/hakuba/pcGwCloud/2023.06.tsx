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
          docId: 'ispc202306releasenotes',
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
          docId: 'ispc202306devsetup',
        },
        {
          label: 'Update',
          docId: 'ispc202306update',
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
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc202306app',
        },
        {
          label: 'Cloud Rating Management',
          docId: 'ispc202306cloudratingmgmt',
        },
        {
          label: 'Contact Management',
          docId: 'is202306contact',
        },
        {
          label: 'Submission Intake',
          docId: 'submissionintake',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc202306admin',
        },
        {
          label: 'Data Archiving',
          docId: 'ispc202306dataarchiving',
        },
        {
          label: 'Observability',
          docId: 'observability',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202306apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202306config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202306global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc202306rules',
        },
        {
          label: 'Guidewire Rules (Early Access)',
          docId: 'gwrules',
        },
        {
          label: 'Guidewire Rules Type Manager (Early Access)',
          docId: 'gwrulestypemgr',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202306pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202306pm',
        },
        {
          label: 'Submission Intake Configuration',
          docId: 'submissionintakeconfig',
        },
        {
          label: 'US Standards-based Template Framework',
          pagePath: 'globalContent/sbt',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202306integoverview',
        },
        {
          label: 'App Events',
          docId: 'appeventsdev',
        },
        {
          label: 'PolicyCenter Cloud API Consumer Guide',
          docId: 'ispc202306apibf',
        },
        {
          label: 'PolicyCenter Cloud API Developer Guide',
          docId: 'ispc202306apica',
        },
        {
          label: 'PolicyCenter Cloud API Reference',
          docId: 'pcapirefhakuba',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'ispc202306apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Pre-built Integrations, and SOAP APIs',
          docId: 'ispc202306integ',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202306restapifw',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
        },
        {
          label: 'Webhooks API Reference',
          docId: 'webhooksapinext',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'API Sandbox',
          docId: 'is202306apisandbox',
        },
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
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba (2023.06)',
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
      {
        label: 'Hakuba (2023.06)',
        pagePath: 'cloudProducts/hakuba/pcGwCloud/2023.06',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202306() {
  return <SectionLayout {...pageConfig} />;
}