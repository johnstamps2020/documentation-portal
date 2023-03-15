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
          docId: 'dx1141peclaimsrelnotes',
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
          docId: 'dx1141peclaimsinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1141peclaimsapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1141peclaimsadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1141peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1141peclaimsrefguides',
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
        pagePath: 'selfManagedProducts/producerEngageCc/11.4.1',
      },
      {
        label: '11.5.0',
        pagePath: 'selfManagedProducts/producerEngageCc/11.5.0',
      },
      {
        label: '11.3.0',
        docId: 'dxpeclaims1130',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage1141() {
  return <SectionLayout {...pageConfig} />;
}
