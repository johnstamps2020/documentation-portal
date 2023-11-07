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
          docId: 'iscc202111releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'iscc202111newandchanged',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrndobson',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'iscc202111devsetup',
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
          docId: 'iscc202111app',
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
          docId: 'iscc202111admin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202111dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202111config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202111global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202111rules',
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
          docId: 'iscc202111apica',
        },
        {
          label: 'Cloud API Business Flows and Configuration',
          docId: 'iscc202111apibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'iscc202111apicm',
        },
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefdobson',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'iscc202111integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202111restapifw',
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
          docId: 'iscc202111testing',
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
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export default function LandingPage202111() {
  return <SectionLayout {...pageConfig} />;
}
