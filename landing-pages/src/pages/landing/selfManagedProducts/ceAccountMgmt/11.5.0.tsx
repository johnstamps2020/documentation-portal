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
          docId: 'dx1150ceamrelnotes',
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
          docId: 'dx1150ceaminstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1150ceamapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1150ceamadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1150ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1150ceamrefguides',
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
        pagePath: '',
      },
      {
        label: '11.4.1',
        pagePath: 'selfManagedProducts/ceAccountMgmt/11.4.1',
      },
      {
        label: '11.3.0',
        docId: 'dxceam1130',
      },
      {
        label: '11.2.0',
        docId: 'dxceam1120onpremstaging',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxceamagmqaagu',
      },
      {
        label: '10.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocsimqfvska',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocswtwqtyvt',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocskaceffks',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocsvvjeexxr',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocsdixvkiug',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1150() {
  return <SectionLayout {...pageConfig} />;
}
