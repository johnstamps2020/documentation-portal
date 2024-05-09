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
          docId: 'ispc202209releasenotes',
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'ispc202209devsetup',
        },
        {
          label: 'Developer Setup (Internal only)',
          docId: 'ispcflainegwdevsetup',
        },
        {
          label: 'Update',
          docId: 'ispc202209update',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools470',
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
          docId: 'ispc202209app',
        },
        {
          label: 'Contact Management',
          docId: 'is202209contact',
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
          docId: 'ispc202209admin',
        },
        {
          label: 'Administration (Internal only)',
          docId: 'ispcflainegwadmin',
        },
        {
          label: 'Data Archiving',
          docId: 'ispc202209dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc202209apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc202209config',
        },
        {
          label: 'Globalization',
          docId: 'ispc202209global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc202209rules',
        },
        {
          label: 'Guidewire Rules for PolicyCenter (Early Access)',
          docId: 'gwrulespc',
        },
        {
          label: 'Product Designer',
          docId: 'ispc202209pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc202209pm',
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
          docId: 'is202209integoverview',
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
          docId: 'ispc202209apibf',
        },
        {
          label: 'PolicyCenter Cloud API Developer Guide',
          docId: 'ispc202209apica',
        },
        {
          label: 'PolicyCenter Cloud API Reference',
          docId: 'pcapirefflaine',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'ispc202209apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Administering Integration Gateway Apps',
          docId: 'integgatewayuirelease',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'ispc202209integ',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc202209restapifw',
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
    selectedItemLabel: 'Flaine (2022.09)',
    items: allSelectors.s1793805ac84baf801d4eb31b00ab1ddf,
    labelColor: 'black',
  },
};

export default function LandingPage202209() {
  return <SectionLayout {...pageConfig} />;
}
