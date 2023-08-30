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
          label: 'Update',
          docId: 'isbc202302update',
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
          label: 'Cloud Integration Basics Course',
          docId: 'cloudintegrationbasics',
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
    label: 'Select cloud release',
    selectedItemLabel: 'Garmisch (2023.02)',
    items: allSelectors.s344cd6ac814e55dd2f6e1bddf2c969db,
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
