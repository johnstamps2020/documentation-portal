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
          docId: 'iscc202011releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'iscc202011newandchanged',
        },
        {
          label: 'Test Automation Release Notes',
          docId: 'testingframeworksrnbanff',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'iscc202011install',
        },
        {
          label: 'Upgrade',
          docId: 'iscc202011upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'iscc202011app',
        },
        {
          label: 'Contact Management',
          docId: 'is202011contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc202011admin',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best practices',
          docId: 'iscc202011bestpractice',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202011config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202011global',
        },
        {
          label: 'Rules',
          docId: 'iscc202011rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'iscc202011integ',
        },
        {
          label: 'Cloud API Business Flows',
          docId: 'iscc202011cloudapibf',
        },
        {
          label: 'Cloud API Configuration and Authentication',
          docId: 'iscc202011cloudapica',
        },
        {
          label: 'Cloud API Reference',
          docId: 'cc202011apiref',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202011restapifw',
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
          docId: 'iscc202011testing',
        },
        {
          label: 'API Testing (GT-API)',
          docId: 'testingframeworksapibanff',
        },
        {
          label: 'User Interface Testing (GT-UI)',
          docId: 'testingframeworksuibanff',
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
    selectedItemLabel: 'Banff (2020.11)',
    items: [
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/claimCenterCloud/ccGwCloud/2020.11',
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
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/claimCenterCloud/ccGwCloud/2021.04',
      },
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/claimCenterCloud',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202011() {
  return <SectionLayout {...pageConfig} />;
}
