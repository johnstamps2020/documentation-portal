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
          docId: 'dx1150ceqbrelnotes',
        },
        {
          label: 'Log4j Patch Release Notes',
          docId: 'dx1150log4jrelnotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dx1150ceqbinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1150ceqbapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1150ceqbadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1150ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1150ceqbrefguides',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '11.5.0',
    items: [
      {
        label: '11.5.0',
        pagePath: 'selfManagedProducts/ceQuoteAndBuy/11.5.0',
      },
      {
        label: '11.4.1',
        pagePath: 'selfManagedProducts/ceQuoteAndBuy/11.4.1',
      },
      {
        label: '11.3.0',
        docId: 'dxceqb1130',
      },
      {
        label: '11.2.0',
        docId: 'dxceqb1120onpremstaging',
      },
      {
        label: '11.1.0',
        docId: 'dxceqb1110onpremstaging',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxceqbphivypaz',
      },
      {
        label: '10.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageuotenduyocswhokisuk',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageuotenduyocsxqghmido',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageuotenduyocssvsmobif',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageuotenduyocswnmqkwxj',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageuotenduyocsmoleigkn',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1150() {
  return <SectionLayout {...pageConfig} />;
}
