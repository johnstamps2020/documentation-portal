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
          docId: 'dx1141srerelnotes',
        },
        {
          label: 'Log4j Patch Release Notes',
          docId: 'dx1141log4jrelnotes',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dx1141sreinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1141sreapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1141sreadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1141sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1141srerefguides',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '11.4.1',
    items: [
      {
        label: '10.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalerviceepngageocstyghellr',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxsreaqsojbmv',
      },
      {
        label: '11.1.0',
        docId: 'dxsre1110onpremstaging',
      },
      {
        label: '11.2.0',
        docId: 'dxsre1120onpremstaging',
      },
      {
        label: '11.3.0',
        docId: 'dxsre1130',
      },
      {
        label: '11.4.1',
        pagePath: 'selfManagedProducts/serviceRepEngage/11.4.1',
      },
      {
        label: '11.5.0',
        pagePath: 'selfManagedProducts/serviceRepEngage/11.5.0',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalerviceepngageocsugutdoki',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalerviceepngageocsrtlpihpc',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalerviceepngageocsqarbsbtn',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalerviceepngageocsdemyrpoh',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1141() {
  return <SectionLayout {...pageConfig} />;
}