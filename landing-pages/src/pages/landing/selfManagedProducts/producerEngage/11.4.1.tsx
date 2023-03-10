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
          docId: 'dx1141perelnotes',
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
          docId: 'dx1141peinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1141peapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1141peadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1141pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1141perefguides',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '11.4.1',
    items: [
      {
        label: '11.4.1',
        pagePath: '',
      },
      {
        label: '11.5.0',
        pagePath: 'selfManagedProducts/producerEngage/11.5.0',
      },
      {
        label: '11.3.0',
        docId: 'dxpe1130',
      },
      {
        label: '11.2.0',
        docId: 'dxpe1120onpremstaging',
      },
      {
        label: '11.1.0',
        docId: 'dxpe1110onpremstaging',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxpemlefekrm',
      },
      {
        label: '10.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsamzzpbvt',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsnoryczgm',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsvhcgqwst',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocseucuheur',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalroducerngageocsneawmwlb',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1141() {
  return <SectionLayout {...pageConfig} />;
}
