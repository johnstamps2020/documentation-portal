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
          docId: 'ispc1021releasenotes',
        },
        {
          label: 'New and Changed',
          docId: 'ispc1021newandchanged',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation',
          docId: 'ispc1021install',
        },
        {
          label: 'Upgrade',
          docId: 'ispc1021upgrade',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'ispc1021app',
        },
        {
          label: 'Contact Management',
          docId: 'ispc1021contact',
        },
        {
          label: 'InsuranceSuite Guide',
          docId: 'ispc1021isguide',
        },
      ],
    },
    {
      label: 'Best Practices',
      items: [
        {
          label: 'Best Practices',
          docId: 'ispc1021best',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration',
          docId: 'ispc1021admin',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Advanced Product Designer in PolicyCenter',
          docId: 'ispc1021apd',
        },
        {
          label: 'Configuration',
          docId: 'ispc1021config',
        },
        {
          label: 'Globalization',
          docId: 'ispc1021global',
        },
        {
          label: 'Gosu Rules',
          docId: 'ispc1021rules',
        },
        {
          label: 'Product Designer',
          docId: 'ispc1021pd',
        },
        {
          label: 'Product Model',
          docId: 'ispc1021pm',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'Integration',
          docId: 'ispc1021integ',
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
          docId: 'ispc1021testing',
        },
        {
          label: 'REST API Framework',
          docId: 'ispc1021restapifw',
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
        pagePath: 'selfManagedProducts/pc/10.2.2',
      },
      {
        label: '10.2.0',
        docId: 'pc1020',
      },
      {
        label: '10.1.2',
        docId: 'pc1012',
      },
      {
        label: '10.1.1',
        docId: 'pc1011',
      },
      {
        label: '10.1.0',
        docId: 'pc1010',
      },
      {
        label: '10.0.3',
        docId: 'selfmanagedpcuytrolxz',
      },
      {
        label: '10.0.2',
        docId: 'selfmanagedpc1002',
      },
      {
        label: '10.0.1',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyentergcxbllrp',
      },
      {
        label: '10.0.0',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterxdtwvycu',
      },
      {
        label: '9.0.10',
        docId: 'pc9010',
      },
      {
        label: '9.0.9',
        docId: 'pc909',
      },
      {
        label: '9.0.8',
        docId: 'pc908',
      },
      {
        label: '9.0.7',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterrtwztpfk',
      },
      {
        label: '9.0.6',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterhzpxxvwz',
      },
      {
        label: '9.0.5',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterwlvmqlps',
      },
      {
        label: '9.0.4',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocnzfemwar',
      },
      {
        label: '9.0.3',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocsetccnkr',
      },
      {
        label: '9.0.2',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdoclzhtwoyw',
      },
      {
        label: '9.0.1',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocfwxqxxjo',
      },
      {
        label: '9.0.0',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocrbuikbrg',
      },
      {
        label: '8.0.8',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocmeibkklu',
      },
      {
        label: '8.0.7',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocucydlhvx',
      },
      {
        label: '8.0.6',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdoclxmhamjs',
      },
      {
        label: '8.0.5',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocafqpzdwd',
      },
      {
        label: '8.0.4',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocpaqllgoi',
      },
      {
        label: '8.0.3',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocfnbhhrvy',
      },
      {
        label: '8.0.2',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocojaabfwj',
      },
      {
        label: '8.0.1',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocewdbghur',
      },
      {
        label: '8.0.0',
        docId: 'httpsportalguidewirecomportalsecuredocpcolicyenterdocjninxbqx',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1021() {
  return <SectionLayout {...pageConfig} />;
}
