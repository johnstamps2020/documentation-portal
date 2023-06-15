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
          docId: 'iscc202302releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'iscc202302devsetup',
        },
        {
          label: 'Developer Setup (Internal only)',
          docId: 'isccgarmischgwdevsetup',
        },
        {
          label: 'Update',
          docId: 'iscc202302update',
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
          docId: 'iscc202302app',
        },
        {
          label: 'Contact Management',
          docId: 'is202302contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc202302admin',
        },
        {
          label: 'Administration (Internal only)',
          docId: 'isccgarmischgwadmin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202302dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202302config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202302global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202302rules',
        },
        {
          label: 'Guidewire Rules (Early Access)',
          docId: 'gwrules',
        },
        {
          label: 'APD for Claims (Early Access)',
          docId: 'apdclaimsgarmisch',
        },
        {
          label: 'Claims Intake FNOL Template (Early Access)',
          docId: 'is202302fnoltemplate',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202302integoverview',
        },
        {
          label: 'App Events',
          docId: 'appeventsdev',
        },
        {
          label: 'ClaimCenter Cloud API Consumer Guide',
          docId: 'iscc202302apibf',
        },
        {
          label: 'ClaimCenter Cloud API Developer Guide',
          docId: 'iscc202302apica',
        },
        {
          label: 'ClaimCenter Cloud API Reference',
          docId: 'ccapirefgarmisch',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'iscc202302apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Pre-built Integrations, and SOAP APIs',
          docId: 'iscc202302integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202302restapifw',
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
    selectedItemLabel: 'Garmisch (2023.02)',
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
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
