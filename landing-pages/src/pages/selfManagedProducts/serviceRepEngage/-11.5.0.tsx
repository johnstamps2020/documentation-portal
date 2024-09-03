import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { allSelectors } from 'components/allSelectors';

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
          docId: 'dx1150srerelnotes',
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
          docId: 'dx1150sreinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1150sreapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1150sreadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1150sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1150srerefguides',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '11.5.0',
    items: allSelectors.s206251df424d4d7759bced1d71908add,
    labelColor: 'black',
  },
};

export default function LandingPage1150() {
  return <SectionLayout {...pageConfig} />;
}
