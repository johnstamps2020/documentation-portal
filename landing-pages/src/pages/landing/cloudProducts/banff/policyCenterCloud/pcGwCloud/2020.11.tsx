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
          docId: 'ispc202011releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc202011newandchanged',
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
          docId: 'ispc202011install',
        },
        {
          label: 'Upgrade',
          docId: 'ispc202011upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc202011app',
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
          docId: 'ispc202011admin',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best practices',
          docId: 'ispc202011bestpractice',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202011apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202011config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202011global',
        },
        {
          label: 'Rules',
          docId: 'ispc202011rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202011pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202011pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'ispc202011integ',
        },
        {
          label: 'Cloud API',
          docId: 'ispc202011cloudapi',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202011restapifw',
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
          docId: 'ispc202011testing',
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
        pagePath: '',
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
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/policyCenterCloud/pcGwCloud/2021.04',
      },
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/policyCenterCloud',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202011() {
  return <SectionLayout {...pageConfig} />;
}
