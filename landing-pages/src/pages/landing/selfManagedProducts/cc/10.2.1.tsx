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
          docId: 'iscc1021releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'iscc1021newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'iscc1021install',
        },
        {
          label: 'Upgrade',
          docId: 'iscc1021upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'iscc1021app',
        },
        {
          label: 'Contact Management',
          docId: 'iscc1021contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'iscc1021isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'iscc1021best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'iscc1021admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration',
          docId: 'iscc1021config',
        },
        {
          label: 'Globalization',
          docId: 'iscc1021global',
        },
        {
          label: 'Gosu Rules',
          docId: 'iscc1021rules',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'iscc1021integ',
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
          docId: 'iscc1021testing',
        },
        {
          label: 'REST API Framework',
          docId: 'iscc1021restapifw',
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
        label: '10.2.1',
        pagePath: '',
      },
      {
        label: '10.2.2',
        pagePath: 'selfManagedProducts/cc/10.2.2',
      },
      {
        label: '10.2.0',
        docId: 'cc1020',
      },
      {
        label: '10.1.2',
        docId: 'cc1012',
      },
      {
        label: '10.1.1',
        docId: 'cc1011',
      },
      {
        label: '10.1.0',
        docId: 'cc1010',
      },
      {
        label: '10.0.3',
        docId: 'selfmanagedccahrgbyin',
      },
      {
        label: '10.0.2',
        docId: 'selfmanagedcc1002',
      },
      {
        label: '10.0.1',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenteruhhqohgq',
      },
      {
        label: '10.0.0',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterqqxmyzex',
      },
      {
        label: '9.0.10',
        docId: 'cc9010',
      },
      {
        label: '9.0.9',
        docId: 'cc909',
      },
      {
        label: '9.0.8',
        docId: 'cc908',
      },
      {
        label: '9.0.7',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterelmxqvai',
      },
      {
        label: '9.0.6',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterwtigvtxy',
      },
      {
        label: '9.0.5',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimentercxzeemjp',
      },
      {
        label: '9.0.4',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocidesewcj',
      },
      {
        label: '9.0.3',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocvqlyczrv',
      },
      {
        label: '9.0.2',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocnlrfsben',
      },
      {
        label: '9.0.1',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdoceytmuoui',
      },
      {
        label: '9.0.0',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocxjnxnozc',
      },
      {
        label: '8.0.7',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocnhpuynwc',
      },
      {
        label: '8.0.6',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocmypqavjm',
      },
      {
        label: '8.0.5',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocbapuerjf',
      },
      {
        label: '8.0.4',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocqeuxmcrz',
      },
      {
        label: '8.0.3',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocpfaqnsti',
      },
      {
        label: '8.0.2',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdochpprlkbr',
      },
      {
        label: '8.0.1',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocaxxmkayt',
      },
      {
        label: '8.0.0',
        docId: 'httpsportalguidewirecomportalsecuredoccclaimenterdocuwuokkoq',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1021() {
  return <SectionLayout {...pageConfig} />;
}
