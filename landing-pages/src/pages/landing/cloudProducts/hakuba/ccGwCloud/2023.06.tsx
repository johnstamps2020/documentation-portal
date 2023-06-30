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
          docId: 'iscc202306releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'iscc202306devsetup',
        },
        {
          label: 'Update',
          docId: 'iscc202306update',
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
          docId: 'iscc202306app',
        },
        {
          label: 'Contact Management',
          docId: 'is202306contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc202306admin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202306dataarchiving',
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
          label: 'Configuration',
          docId: 'iscc202306config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202306global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202306rules',
        },
        {
          label: 'Guidewire Rules (Early Access)',
          docId: 'gwrules',
        },
        {
          label: 'APD for Claims (Early Access)',
          docId: 'apdclaimshakuba',
        },
        {
          label: 'Claims Intake FNOL Template (Early Access)',
          docId: 'is202306fnoltemplate',
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
          label: 'ClaimCenter Cloud API Consumer Guide',
          docId: 'iscc202306apibf',
        },
        {
          label: 'ClaimCenter Cloud API Developer Guide',
          docId: 'iscc202306apica',
        },
        {
          label: 'ClaimCenter Cloud API Reference',
          docId: 'ccapirefhakuba',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'iscc202306apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Pre-built Integrations, and SOAP APIs',
          docId: 'iscc202306integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202306restapifw',
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
        pagePath: 'cloudProducts/aspen/claimCenterCloud',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/claimCenterCloud/ccGwCloud/2020.11',
      },
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/claimCenterCloud/ccGwCloud/2021.04',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/ccGwCloud/2021.11',
      },
      {
        label: 'Elysian (2022.05)',
        pagePath: 'cloudProducts/elysian/ccGwCloud/2022.05',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/ccGwCloud/2022.09',
      },
      {
        label: 'Garmisch (2023.02)',
        pagePath: 'cloudProducts/garmisch/ccGwCloud/2023.02',
      },
      {
        label: 'Hakuba (2023.06)',
        pagePath: 'cloudProducts/hakuba/ccGwCloud/2023.06',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202306() {
  return <SectionLayout {...pageConfig} />;
}
