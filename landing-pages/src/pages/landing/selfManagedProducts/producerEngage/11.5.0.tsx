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
          docId: 'dx1150perelnotes',
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
          docId: 'dx1150peinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1150peapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1150peadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1150pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1150perefguides',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '11.5.0',
    items: [
      {
        label: '10.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsamzzpbvt',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxpemlefekrm',
      },
      {
        label: '11.1.0',
        docId: 'dxpe1110onpremstaging',
      },
      {
        label: '11.2.0',
        docId: 'dxpe1120onpremstaging',
      },
      {
        label: '11.3.0',
        docId: 'dxpe1130',
      },
      {
        label: '11.4.1',
        pagePath: 'selfManagedProducts/producerEngage/11.4.1',
      },
      {
        label: '11.5.0',
        pagePath: 'selfManagedProducts/producerEngage/11.5.0',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsneawmwlb',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocseucuheur',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsvhcgqwst',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsnoryczgm',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1150() {
  return <SectionLayout {...pageConfig} />;
}
