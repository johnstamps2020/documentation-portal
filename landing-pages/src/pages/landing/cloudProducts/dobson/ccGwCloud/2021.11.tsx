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
          docId: 'iscc202111releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'iscc202111newandchanged',
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
          docId: 'iscc202111devsetup',
        },
        {
          label: 'Upgrade',
          docId: 'iscc202111upgrade',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools450',
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
          docId: 'iscc202111app',
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
          docId: 'iscc202111admin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202111dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202111config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202111global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202111rules',
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
          label: 'Cloud API Authentication',
          docId: 'iscc202111apica',
        },
        {
          label: 'Cloud API Business Flows and Configuration',
          docId: 'iscc202111apibf',
        },
        {
          label: 'Cloud API ContactManager',
          docId: 'iscc202111apicm',
        },
        {
          label: 'Cloud API Reference',
          docId: 'ccapirefdobson',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'iscc202111integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202111restapifw',
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
          docId: 'iscc202111testing',
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
    label: 'Select release',
    selectedItemLabel: 'Dobson (2021.11)',
    items: [
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/claimCenterCloud',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/claimCenterCloud/ccGwCloud/2020.11',
      },
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/claimCenterCloud/ccGwCloud/2021.04',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/ccGwCloud/2021.11',
      },
      {
        label: 'Elysian (2022.05)',
        pagePath: 'cloudProducts/elysian/ccGwCloud/2022.05',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/ccGwCloud/2022.09',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202111() {
  return <SectionLayout {...pageConfig} />;
}
