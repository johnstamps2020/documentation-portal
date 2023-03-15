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
        {
          label: 'Upgrade',
          docId: 'ispc202104upgrade',
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
    label: 'Select release',
    selectedItemLabel: 'Cortina (2021.04)',
    items: [
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/policyCenterCloud/pcGwCloud/2021.04',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/pcGwCloud/2022.09',
      },
      {
        label: 'Elysian (2022.05)',
        pagePath: 'cloudProducts/elysian/pcGwCloud/2022.05',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/pcGwCloud/2021.11',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/policyCenterCloud/pcGwCloud/2020.11',
      },
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/policyCenterCloud',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
