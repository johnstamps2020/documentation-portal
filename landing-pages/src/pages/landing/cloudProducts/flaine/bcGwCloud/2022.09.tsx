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
          docId: 'isbc202209releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'isbc202209devsetup',
        },
        {
          label: 'Developer Setup (Internal only)',
          docId: 'isbcflainegwdevsetup',
        },
        {
          label: 'Update',
          docId: 'isbc202209update',
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
          docId: 'isbc202209app',
        },
        {
          label: 'Contact Management',
          docId: 'is202209contact',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'isbc202209admin',
        },
        {
          label: 'Administration (Internal only)',
          docId: 'isbcflainegwadmin',
        },
        {
          label: 'Data Archiving',
          docId: 'isbc202209dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'isbc202209config',
        },
        {
          label: 'Globalization',
          docId: 'isbc202209global',
        },
        {
          label: 'Gosu Rules',
          docId: 'isbc202209rules',
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
          label: 'BillingCenter Cloud API Consumer Guide',
          docId: 'isbc202209apibf',
        },
        {
          label: 'BillingCenter Cloud API Developer Guide',
          docId: 'isbc202209apica',
        },
        {
          label: 'BillingCenter Cloud API Reference',
          docId: 'bcapirefflaine',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'isbc202209apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Pre-built Integrations, and SOAP APIs',
          docId: 'isbc202209integ',
        },
        {
          label: 'REST API Framework',
          docId: 'isbc202209restapifw',
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
    selectedItemLabel: 'Flaine (2022.09)',
    items: allSelectors.s344cd6ac814e55dd2f6e1bddf2c969db,
    labelColor: 'black',
  },
};

export default function LandingPage202209() {
  return <SectionLayout {...pageConfig} />;
}
