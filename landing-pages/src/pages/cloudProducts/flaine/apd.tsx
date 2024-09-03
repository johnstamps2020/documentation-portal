import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Flaine (2022.09)',
    items: allSelectors.apdApp,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'APD App Release Notes',
          docId: 'apdapprnflaine',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'APD App Guide',
          docId: 'apdappflaine',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'APD API Reference',
          docId: 'apdmaindoc',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/flaine/apd')({
  component: Apd,
});

function Apd() {
  return <SectionLayout {...pageConfig} />;
}
