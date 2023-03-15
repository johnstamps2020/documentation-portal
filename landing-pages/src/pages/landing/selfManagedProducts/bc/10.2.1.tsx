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
          docId: 'isbc1021releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'isbc1021newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'isbc1021install',
        },
        {
          label: 'Upgrade',
          docId: 'isbc1021upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'isbc1021app',
        },
        {
          label: 'Contact Management',
          docId: 'isbc1021contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'isbc1021isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'isbc1021best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'isbc1021admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'isbc1021config',
        },
        {
          label: 'Globalization',
          docId: 'isbc1021global',
        },
        {
          label: 'Gosu Rules',
          docId: 'isbc1021rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'isbc1021integ',
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
        {
          label: 'ISBTF and GUnit Testing',
          docId: 'isbc1021testing',
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
    selectedItemLabel: '10.2.1',
    items: [
      {
        label: '10.0.0',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterlhkdzceb',
      },
      {
        label: '10.0.1',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingentervdugkpgr',
      },
      {
        label: '10.0.2',
        docId: 'selfmanagedbc1002',
      },
      {
        label: '10.0.3',
        docId: 'selfmanagedbcfxhglseu',
      },
      {
        label: '10.1.0',
        docId: 'bc1010',
      },
      {
        label: '10.1.1',
        docId: 'bc1011',
      },
      {
        label: '10.1.2',
        docId: 'bc1012',
      },
      {
        label: '10.2.0',
        docId: 'bc1020',
      },
      {
        label: '10.2.1',
        pagePath: 'selfManagedProducts/bc/10.2.1',
      },
      {
        label: '10.2.2',
        pagePath: 'selfManagedProducts/bc/10.2.2',
      },
      {
        label: '8.0.0',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocammzblnv',
      },
      {
        label: '8.0.1',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdoccjtmugit',
      },
      {
        label: '8.0.2',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocqfdehuey',
      },
      {
        label: '8.0.3',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocffmmswgf',
      },
      {
        label: '8.0.4',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdoceiifgxcw',
      },
      {
        label: '8.0.5',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocccsrmkdc',
      },
      {
        label: '8.0.6',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdoczxmrlibm',
      },
      {
        label: '8.0.7',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdockdppxpda',
      },
      {
        label: '9.0.0',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocyoyphgem',
      },
      {
        label: '9.0.1',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocfmnupekf',
      },
      {
        label: '9.0.10',
        docId: 'bc9010',
      },
      {
        label: '9.0.2',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocjoxldmbo',
      },
      {
        label: '9.0.3',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocfcmljyqa',
      },
      {
        label: '9.0.4',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterdocicbeksro',
      },
      {
        label: '9.0.5',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterlmkrswrz',
      },
      {
        label: '9.0.6',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterkxubulyh',
      },
      {
        label: '9.0.7',
        docId: 'httpsportalguidewirecomportalsecuredocbcillingenterkqqanxwh',
      },
      {
        label: '9.0.8',
        docId: 'bc908',
      },
      {
        label: '9.0.9',
        docId: 'bc909',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1021() {
  return <SectionLayout {...pageConfig} />;
}
