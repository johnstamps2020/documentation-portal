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
          docId: 'iscc202310releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'iscc202310devsetup',
        },
        {
          label: 'Update',
          docId: 'iscc202310update',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools500',
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
          docId: 'iscc202310app',
        },
        {
          label: 'Contact Management',
          docId: 'is202310contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc202310admin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202310dataarchiving',
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
          docId: 'iscc202310config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202310global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202310rules',
        },
        {
          label: 'Guidewire Rules (Early Access)',
          docId: 'gwrules',
        },
        {
          label: 'APD for Claims (Early Access)',
          docId: 'apdclaimsinnsbruck',
        },
        {
          label: 'Personal Auto FNOL Template (Early Access)',
          docId: 'fnoltemplatemain',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202310integoverview',
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
          label: 'ClaimCenter Cloud API Consumer Guide',
          docId: 'iscc202310apibf',
        },
        {
          label: 'ClaimCenter Cloud API Developer Guide',
          docId: 'iscc202310apica',
        },
        {
          label: 'ClaimCenter Cloud API Reference',
          docId: 'ccapirefinnsbruck',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'iscc202310apicm',
        },
        {
          label: 'Integration Data Manager',
          docId: 'iscc202310integdatamgr',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'iscc202310integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202310restapifw',
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
          docId: 'is202310apisandbox',
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
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export default function LandingPage202310() {
  return <SectionLayout {...pageConfig} />;
}
