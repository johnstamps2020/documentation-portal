import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { allSelectors } from 'components/allSelectors';

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
          docId: 'isbc202306releasenotes',
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
          docId: 'isbc202306devsetup',
        },
        {
          label: 'Update',
          docId: 'isbc202306update',
        },
        {
          label: 'InsuranceSuite Configuration Upgrade Tools',
          docId: 'isconfigupgradetools530',
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
          docId: 'isbc202306app',
        },
        {
          label: 'Contact Management',
          docId: 'is202306contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'isbc202306admin',
        },
        {
          label: 'Data Archiving',
          docId: 'isbc202306dataarchiving',
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
          label: 'Configuration',
          docId: 'isbc202306config',
        },
        {
          label: 'Globalization',
          docId: 'isbc202306global',
        },
        {
          label: 'Gosu Rules',
          docId: 'isbc202306rules',
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
          label: 'BillingCenter Cloud API Consumer Guide',
          docId: 'isbc202306apibf',
        },
        {
          label: 'BillingCenter Cloud API Developer Guide',
          docId: 'isbc202306apica',
        },
        {
          label: 'BillingCenter Cloud API Reference',
          docId: 'bcapirefhakuba',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'isbc202306apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'isbc202306integ',
        },
        {
          label: 'REST API Framework',
          docId: 'isbc202306restapifw',
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
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba (2023.06)',
    items: allSelectors.s344cd6ac814e55dd2f6e1bddf2c969db,
    labelColor: 'black',
  },
};

export default function LandingPage202306() {
  return <SectionLayout {...pageConfig} />;
}
