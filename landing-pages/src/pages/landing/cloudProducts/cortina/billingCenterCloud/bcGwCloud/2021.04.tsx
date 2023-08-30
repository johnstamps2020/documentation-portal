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
          docId: 'isbc202104releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'isbc202104newandchanged',
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
          docId: 'isbc202104install',
        },
        {
          label: 'Upgrade',
          docId: 'isbc202104upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'isbc202104app',
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
          docId: 'isbc202104admin',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best practices',
          docId: 'isbc202104bestpractice',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'isbc202104config',
        },
        {
          label: 'Globalization',
          docId: 'isbc202104global',
        },
        {
          label: 'Rules',
          docId: 'isbc202104rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'isbc202104integ',
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
          docId: 'isbc202104testing',
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
    items: allSelectors.s344cd6ac814e55dd2f6e1bddf2c969db,
    labelColor: 'black',
  },
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
