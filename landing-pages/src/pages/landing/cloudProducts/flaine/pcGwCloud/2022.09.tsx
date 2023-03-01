import { baseBackgroundProps } from '../../..';
import SectionLayout, {
  SectionLayoutProps,
} from '../../../../../components/LandingPage/Section/SectionLayout';

const docs: SectionLayoutProps['sections'] = [
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
        label: 'Guidewire Rules (Early Access)',
        docId: 'gwrules',
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
        docId: 'submissionintakeconfig',
      },
      {
        label: 'US Standards-based Template Framework',
        pagePath: '../../../../globalContent/sbt',
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
        label: 'Plugins, Pre-built Integrations, and SOAP APIs',
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
];

const selector: SectionLayoutProps['selector'] = {
  label: 'Select release',
  selectedItemLabel: 'Flaine (2022.09)',
  items: [
    {
      label: 'Flaine (2022.09)',
      href: 'cloudProducts/flaine/pcGwCloud/2022.09',
    },
    {
      label: 'Elysian (2022.05)',
      href: 'cloudProducts/elysian/pcGwCloud/2022.05',
    },
    {
      label: 'Dobson (2021.11)',
      href: 'cloudProducts/dobson/pcGwCloud/2021.11',
    },
    {
      label: 'Cortina (2021.04)',
      href: 'cloudProducts/cortina/policyCenterCloud/pcGwCloud/2021.04',
    },
    {
      label: 'Banff (2020.11)',
      href: 'cloudProducts/banff/policyCenterCloud/pcGwCloud/2020.11',
    },
    {
      label: 'Aspen (2020.05)',
      href: 'cloudProducts/aspen/policyCenterCloud',
    },
  ],
  labelColor: 'black',
};

const backgroundProps: SectionLayoutProps['backgroundProps'] = {
  ...baseBackgroundProps,
  backgroundColor: 'hsl(0, 0%, 98%)',
};
export default function pcGwCloud202209() {
  return (
    <SectionLayout
      sections={docs}
      backgroundProps={backgroundProps}
      selector={selector}
    />
  );
}
