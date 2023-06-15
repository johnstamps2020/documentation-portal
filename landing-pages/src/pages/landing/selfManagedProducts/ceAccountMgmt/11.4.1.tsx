import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

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
          label: 'Release Notes',
          docId: 'dx1141ceamrelnotes',
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
          docId: 'dx1141ceaminstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1141ceamapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1141ceamadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1141ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1141ceamrefguides',
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
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocsimqfvska',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxceamagmqaagu',
      },
      {
        label: '11.2.0',
        docId: 'dxceam1120onpremstaging',
      },
      {
        label: '11.3.0',
        docId: 'dxceam1130',
      },
      {
        label: '11.4.1',
        pagePath: 'selfManagedProducts/ceAccountMgmt/11.4.1',
      },
      {
        label: '11.5.0',
        pagePath: 'selfManagedProducts/ceAccountMgmt/11.5.0',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocsdixvkiug',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocsvvjeexxr',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocskaceffks',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalustomerngageccountanagementocswtwqtyvt',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1141() {
  return <SectionLayout {...pageConfig} />;
}
