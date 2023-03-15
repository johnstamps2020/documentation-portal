import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
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
    label: 'Select release',
    selectedItemLabel: 'Cortina (2021.04)',
    items: [
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/claimCenterCloud/ccGwCloud/2021.04',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/ccGwCloud/2022.09',
      },
      {
        label: 'Elysian (2022.05)',
        pagePath: 'cloudProducts/elysian/ccGwCloud/2022.05',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/ccGwCloud/2021.11',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/claimCenterCloud/ccGwCloud/2020.11',
      },
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/claimCenterCloud',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
