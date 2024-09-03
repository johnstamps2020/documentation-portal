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
    selectedItemLabel: 'Hakuba (2023.06)',
    items: allSelectors.apdApp,
    labelColor: 'black',
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'APD App Release Notes',
          docId: 'apdapprnhakuba',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'APD App Guide',
          docId: 'apdapphakuba',
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

export const Route = createFileRoute('/cloudProducts/hakuba/apd')({
  component: Apd,
});

function Apd() {
  return <SectionLayout {...pageConfig} />;
}
