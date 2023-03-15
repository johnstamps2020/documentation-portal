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
          docId: 'dx1150verelnotes',
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
          docId: 'dx1150veinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1150veapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1150veadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1150vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1150verefguides',
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
        pagePath: 'selfManagedProducts/vendorEngage/11.5.0',
      },
      {
        label: '11.4.1',
        pagePath: 'selfManagedProducts/vendorEngage/11.4.1',
      },
      {
        label: '11.3.0',
        docId: 'dxve1130',
      },
      {
        label: '10.0.1',
        docId: 'selfmanageddxvebjvtkgov',
      },
      {
        label: '10.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalendorngageocsqblntzzp',
      },
      {
        label: '8.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalendorngageocshfhoxxya',
      },
      {
        label: '8.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalendorngageocsyrmcgnnq',
      },
      {
        label: '7.1.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalendorngageocsgehgsaei',
      },
      {
        label: '7.0.0',
        docId:
          'httpsportalguidewirecomportalsecuredocdigitalendorngageocsjkkjagrp',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1150() {
  return <SectionLayout {...pageConfig} />;
}
