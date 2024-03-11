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
          docId: 'ispc202306releasenotes',
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
          docId: 'ispc202306devsetup',
        },
        {
          label: 'Update',
          docId: 'ispc202306update',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools520',
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
          docId: 'ispc202306app',
        },
        {
          label: 'Cloud Rating Management (Early Access)',
          docId: 'ispc202306cloudratingmgmt',
        },
        {
          label: 'Contact Management',
          docId: 'is202306contact',
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
          docId: 'ispc202306admin',
        },
        {
          label: 'Data Archiving',
          docId: 'ispc202306dataarchiving',
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
          docId: 'ispc202306apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202306config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202306global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc202306rules',
        },
        {
          label: 'Guidewire Rules for PolicyCenter (Early Access)',
          docId: 'gwrulespc',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202306pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202306pm',
        },
        {
          label: 'Submission Intake Configuration',
          docId: 'submissionintake',
          pathInDoc: '?contextid=submissionIntakeConfiguration',
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
          docId: 'is202306integoverview',
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
          label: 'Webhooks',
          docId: 'webhooksrelease',
        },
        {
          label: 'PolicyCenter Cloud API Consumer Guide',
          docId: 'ispc202306apibf',
        },
        {
          label: 'PolicyCenter Cloud API Developer Guide',
          docId: 'ispc202306apica',
        },
        {
          label: 'PolicyCenter Cloud API Reference',
          docId: 'pcapirefhakuba',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'ispc202306apicm',
        },
        {
          label: 'Integration Data Manager',
          docId: 'ispc202306integdatamgr',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'ispc202306integ',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202306restapifw',
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
          docId: 'is202306apisandbox',
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
    selectedItemLabel: 'Hakuba (2023.06)',
    items: allSelectors.s1793805ac84baf801d4eb31b00ab1ddf,
    labelColor: 'black',
  },
};

export default function LandingPage202306() {
  return <SectionLayout {...pageConfig} />;
}
