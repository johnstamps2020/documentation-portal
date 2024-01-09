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
          docId: 'ispc202104releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc202104newandchanged',
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
          docId: 'ispc202104install',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc202104app',
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
          docId: 'ispc202104admin',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best practices',
          docId: 'ispc202104bestpractice',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202104apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202104config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202104global',
        },
        {
          label: 'Rules',
          docId: 'ispc202104rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202104pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202104pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'ispc202104integ',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'ispc202104cloudapibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'ispc202104cloudapicm',
        },
        {
          label: 'Cloud API Authentication',
          docId: 'ispc202104cloudapica',
        },
        {
          label: 'Cloud API Reference',
          docId: 'pc202104apiref',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202104restapifw',
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
          docId: 'ispc202104testing',
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
    items: allSelectors.s1793805ac84baf801d4eb31b00ab1ddf,
    labelColor: 'black',
  },
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
