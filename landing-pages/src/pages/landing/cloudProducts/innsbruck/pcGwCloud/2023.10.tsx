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
          docId: 'ispc202310releasenotes',
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
        },
        {
          label: 'Studio Release Notes',
          docId: 'isstudiolatestrn',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'ispc202310devsetup',
        },
        {
          label: 'Update',
          docId: 'ispc202310update',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools500',
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
          docId: 'ispc202310app',
        },
        {
          label: 'Cloud Rating Management (Early Access)',
          docId: 'ispc202310cloudratingmgmt',
        },
        {
          label: 'Contact Management',
          docId: 'is202310contact',
        },
        {
          label: 'Submission Intake',
          docId: 'submissionintake',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc202310admin',
        },
        {
          label: 'Data Archiving',
          docId: 'ispc202310dataarchiving',
        },
        {
          label: 'Observability',
          docId: 'observability',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202310apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202310config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202310global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc202310rules',
        },
        {
          label: 'Guidewire Rules (Early Access)',
          docId: 'gwrules',
        },
        {
          label: 'Guidewire Rules Type Manager (Early Access)',
          docId: 'gwrulestypemgr',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202310pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202310pm',
        },
        {
          label: 'Submission Intake Configuration',
          url: '/cloud/subintake/?contextid=submissionIntakeConfiguration',
          videoIcon: false,
        },
        {
          label: 'US Standards-based Template Framework',
          pagePath: 'globalContent/sbt',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Overview of Cloud Integration',
          docId: 'is202310integoverview',
        },
        {
          label: 'Cloud Integration Basics Course',
          docId: 'cloudintegrationbasics',
        },
        {
          label: 'App Events',
          docId: 'appeventsdev',
        },
        {
          label: 'PolicyCenter Cloud API Consumer Guide',
          docId: 'ispc202310apibf',
        },
        {
          label: 'PolicyCenter Cloud API Developer Guide',
          docId: 'ispc202310apica',
        },
        {
          label: 'PolicyCenter Cloud API Reference',
          docId: 'pcapirefinnsbruck',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'ispc202310apicm',
        },
        {
          label: 'Integration Data Manager',
          docId: 'ispc202310integdatamgr',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'ispc202310integ',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202310restapifw',
        },
        {
          label: 'REST API Client',
          docId: 'isrestapiclientguide',
        },
        {
          label: 'Webhooks API Reference',
          docId: 'webhooksapinext',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'API Sandbox',
          docId: 'is202310apisandbox',
        },
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
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.s1793805ac84baf801d4eb31b00ab1ddf,
    labelColor: 'black',
  },
};

export default function LandingPage202310() {
  return <SectionLayout {...pageConfig} />;
}
