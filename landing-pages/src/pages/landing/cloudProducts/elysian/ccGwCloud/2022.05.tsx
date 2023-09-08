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
          docId: 'iscc202205releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'iscc202205devsetup',
        },
        {
          label: 'Upgrade',
          docId: 'iscc202205upgrade',
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
          docId: 'iscc202205app',
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
          docId: 'iscc202205admin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202205dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202205config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202205global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202205rules',
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
          docId: 'ccapirefelysian',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'iscc202205apica',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'iscc202205apibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'iscc202205apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'iscc202205integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202205restapifw',
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
    label: 'Select cloud release',
    selectedItemLabel: 'Elysian (2022.05)',
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export default function LandingPage202205() {
  return <SectionLayout {...pageConfig} />;
}
