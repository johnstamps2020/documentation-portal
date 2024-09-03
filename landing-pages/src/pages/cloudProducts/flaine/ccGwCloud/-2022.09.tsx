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
          docId: 'iscc202209releasenotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Developer Setup',
          docId: 'iscc202209devsetup',
        },
        {
          label: 'Developer Setup (Internal only)',
          docId: 'isccflainegwdevsetup',
        },
        {
          label: 'Update',
          docId: 'iscc202209update',
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
          docId: 'iscc202209app',
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
          docId: 'iscc202209admin',
        },
        {
          label: 'Administration (Internal only)',
          docId: 'isccflainegwadmin',
        },
        {
          label: 'Data Archiving',
          docId: 'iscc202209dataarchiving',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc202209config',
        },
        {
          label: 'Globalization',
          docId: 'iscc202209global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc202209rules',
        },
        {
          label: 'Guidewire Rules for ClaimCenter (Early Access)',
          docId: 'gwrulescc',
        },
        {
          label: 'Claims Intake FNOL Template (Early Access)',
          docId: 'is202209fnoltemplate',
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
          label: 'ClaimCenter Cloud API Consumer Guide',
          docId: 'iscc202209apibf',
        },
        {
          label: 'ClaimCenter Cloud API Developer Guide',
          docId: 'iscc202209apica',
        },
        {
          label: 'ClaimCenter Cloud API Reference',
          docId: 'ccapirefflaine',
        },
        {
          label: 'ContactManager Cloud API Consumer Guide',
          docId: 'iscc202209apicm',
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatest',
        },
        {
          label: 'Plugins, Prebuilt Integrations, and SOAP APIs',
          docId: 'iscc202209integ',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc202209restapifw',
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
    items: allSelectors.seab31eee2944c2607a774b9dd9cda0ad,
    labelColor: 'black',
  },
};

export default function LandingPage202209() {
  return <SectionLayout {...pageConfig} />;
}
