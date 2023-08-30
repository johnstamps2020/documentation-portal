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
          docId: 'iscc202104releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'iscc202104newandchanged',
        },
        {
          label: 'Guidewire Testing Framework Release Notes',
          docId: 'testingframeworksrncortina',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'iscc202104install',
        },
        {
          label: 'Upgrade',
          docId: 'iscc202104upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'iscc202104app',
        },
        {
          label: 'Contact Management',
          docId: 'is202104contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc202104admin',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best practices',
          docId: 'iscc202104bestpractice',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202104config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202104global',
        },
        {
          label: 'Rules',
          docId: 'iscc202104rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'iscc202104integ',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'iscc202104cloudapibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'iscc202104cloudapicm',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'iscc202104cloudapica',
        },
        {
          label: 'Cloud API Reference',
          docId: 'cc202104apiref',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202104restapifw',
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
          label: 'ISBTF and GUnit Testing',
          docId: 'iscc202104testing',
        },
        {
          label: 'API Testing (GT: API)',
          docId: 'testingframeworksapicortina',
        },
        {
          label: 'User Interface Testing (GT: UI)',
          docId: 'testingframeworksuicortina',
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
    selectedItemLabel: 'Cortina (2021.04)',
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
