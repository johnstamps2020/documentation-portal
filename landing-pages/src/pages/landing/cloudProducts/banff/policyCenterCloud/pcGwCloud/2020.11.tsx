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
    label: 'Select cloud release',
    selectedItemLabel: 'Banff (2020.11)',
    items: allSelectors.sd9a35f8d6c6966748440440ab5f1f654,
    labelColor: 'black',
  },
};

export default function LandingPage202011() {
  return <SectionLayout {...pageConfig} />;
}
