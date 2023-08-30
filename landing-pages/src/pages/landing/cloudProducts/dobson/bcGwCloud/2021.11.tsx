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
          docId: 'isbc202111releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'isbc202111newandchanged',
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
          docId: 'isbc202111devsetup',
        },
        {
          label: 'Upgrade',
          docId: 'isbc202111upgrade',
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
          docId: 'isbc202111app',
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
          docId: 'isbc202111admin',
        },
        {
          label: 'Data Archiving',
          docId: 'isbc202111dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'isbc202111config',
        },
        {
          label: 'Globalization',
          docId: 'isbc202111global',
        },
        {
          label: 'Gosu Rules',
          docId: 'isbc202111rules',
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
          label: 'Cloud API Business Flows and Configuration',
          docId: 'isbc202111apibf',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'isbc202111integ',
        },
        {
          label: 'REST API Framework',
          docId: 'isbc202111restapifw',
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
          docId: 'isbc202111testing',
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
    items: allSelectors.s344cd6ac814e55dd2f6e1bddf2c969db,
    labelColor: 'black',
  },
};

export default function LandingPage202111() {
  return <SectionLayout {...pageConfig} />;
}
