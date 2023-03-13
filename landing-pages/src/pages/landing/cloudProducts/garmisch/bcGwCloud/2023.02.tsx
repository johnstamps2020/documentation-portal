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
          docId: 'isbc202302releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'isbc202302devsetup',
        },
        {
          label: 'Developer Setup (Internal only)',
          docId: 'isbcgarmischgwdevsetup',
        },
        {
          label: 'Update',
          docId: 'isbc202302update',
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
          docId: 'isbc202302app',
        },
        {
          label: 'Contact Management',
          docId: 'is202302contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'isbc202302admin',
        },
        {
          label: 'Administration (Internal only)',
          docId: 'isbcgarmischgwadmin',
        },
        {
          label: 'Data Archiving',
          docId: 'isbc202302dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'isbc202302config',
        },
        {
          label: 'Globalization',
          docId: 'isbc202302global',
        },
        {
          label: 'Gosu Rules',
          docId: 'isbc202302rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202302integoverview',
        },
        {
          label: 'BillingCenter Cloud API Consumer Guide',
          docId: 'isbc202302apibf',
        },
        {
          label: 'BillingCenter Cloud API Developer Guide',
          docId: 'isbc202302apica',
        },
        {
          label: 'BillingCenter Cloud API Reference',
          docId: 'bcapirefgarmisch',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'isbc202302apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Pre-built Integrations, and SOAP APIs',
          docId: 'isbc202302integ',
        },
        {
          label: 'REST API Framework',
          docId: 'isbc202302restapifw',
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
    selectedItemLabel: 'Garmisch (2023.02)',
    items: [
      {
        label: 'Garmisch (2023.02)',
        pagePath: '',
      },
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/bcGwCloud/2022.09',
      },
      {
        label: 'Elysian (2022.05)',
        pagePath: 'cloudProducts/elysian/bcGwCloud/2022.05',
      },
      {
        label: 'Dobson (2021.11)',
        pagePath: 'cloudProducts/dobson/bcGwCloud/2021.11',
      },
      {
        label: 'Cortina (2021.04)',
        pagePath: 'cloudProducts/cortina/billingCenterCloud/bcGwCloud/2021.04',
      },
      {
        label: 'Banff (2020.11)',
        pagePath: 'cloudProducts/banff/billingCenterCloud/bcGwCloud/2020.11',
      },
      {
        label: 'Aspen (2020.05)',
        pagePath: 'cloudProducts/aspen/billingCenterCloud',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
