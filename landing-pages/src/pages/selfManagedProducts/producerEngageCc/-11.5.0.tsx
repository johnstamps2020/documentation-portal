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
          docId: 'dx1150peclaimsrelnotes',
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
          docId: 'dx1150peclaimsinstall',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'dx1150peclaimsapp',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration and Security Guide',
          docId: 'dx1150peclaimsadmin',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: "Developer's Guide",
          docId: 'dx1150peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx1150peclaimsrefguides',
        },
      ],
    },
  ],
  selector: {
    label: 'Select release',
    selectedItemLabel: '11.5.0',
    items: allSelectors.s2164631f4aef55e02a4fa874865aeff5,
    labelColor: 'black',
  },
};

export default function LandingPage1150() {
  return <SectionLayout {...pageConfig} />;
}
