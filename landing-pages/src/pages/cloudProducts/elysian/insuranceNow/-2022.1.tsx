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
          label: 'Core Release Notes',
          docId: 'in20221rn',
        },
        {
          label: 'Release Video',
          url: 'https://youtu.be/WGOfsecyPH8',
          videoIcon: true,
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20221studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20221rn',
        },
        {
          label: 'AppReader Release Notes',
          docId: 'appreaderrn400',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'in20221app',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20221csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20221cservicep',
        },
        {
          label: 'Excel Designed Rating',
          docId: 'inexcelrating30',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'AppReader Integration',
          docId: 'in20221appreaderinteg',
        },
        {
          label: 'Guidewire Predict Integration',
          docId: 'in20221pa',
        },
        {
          label: 'API Reference',
          docId: 'in20221apiref',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'API Modernization',
          docId: 'inapimodernization',
        },
        {
          label: 'Custom API Development',
          docId: 'inapidevelopment',
        },
        {
          label: 'Developer Setup - Internal',
          docId: 'indevguidejava11draft',
        },
        {
          label: 'Developer Setup',
          docId: 'indevguidejava11ext',
        },
        {
          label: 'GWCP Operations for InsuranceNow',
          docId: 'ingwcpops',
        },
        {
          label: 'Portal Development',
          docId: 'in20221portaldev',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration',
          docId: 'in20221config',
        },
        {
          label: 'Studio Configuration',
          docId: 'in20221studio',
        },
        {
          label: 'Billing Configuration Reference',
          docId: 'in20221billref',
        },
        {
          label: 'Claims Configuration Reference',
          docId: 'in20221claimsconfig',
        },
        {
          label: 'Underwriting Configuration Reference',
          docId: 'in20221uwconfig',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20221prodattref',
        },
        {
          label: 'Common Functionality Configuration Reference',
          docId: 'in20221commonconfig',
        },
        {
          label: 'Consumer Sales Portal Configuration',
          docId: 'in20221xcsalespconfigdraft',
        },
        {
          label: 'Consumer Service Portal Configuration',
          docId: 'in20221xcservicepconfigdraft',
        },
        {
          label: 'Provisioning Portal',
          docId: 'in20221provportal',
        },
        {
          label: 'Provisioning Portal - Internal',
          docId: 'in20221provportalinternal',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Install Assist',
          docId: 'ininstallassistdraft',
        },
        {
          label: 'Upgrade Tools',
          docId: 'inupgradetoolsdraft',
        },
      ],
    },
  ],
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Elysian (2022.1)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20221() {
  return <SectionLayout {...pageConfig} />;
}
