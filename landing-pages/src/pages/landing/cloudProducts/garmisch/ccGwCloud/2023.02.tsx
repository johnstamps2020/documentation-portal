import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
          label: 'Update',
          docId: 'iscc202302update',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools470',
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
          label: 'Guidewire Rules for ClaimCenter (Early Access)',
          docId: 'gwrulescc',
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
          label: 'Cloud Integration Basics Course',
          docId: 'cloudintegrationbasics',
        },
        {
          label: 'App Events',
          docId: 'appeventsdev',
        },
        {
          label: 'Webhooks',
          docId: 'webhooksrelease',
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
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
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
    label: 'Select cloud release',
    selectedItemLabel: 'Garmisch (2023.02)',
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
