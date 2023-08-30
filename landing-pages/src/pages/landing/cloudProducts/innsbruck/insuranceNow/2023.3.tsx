import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
          label: 'Core Release Notes',
          docId: 'in20233rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/1/player/guidewire?pi=zHjz8nvg0ziJoAz0&r3f1=&fb=0',
          videoIcon: true,
        },
      ],
    },
  ],
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba (2023.2)',
    items: allSelectors.s3d4a4aa793fe835d0387d5969693de6d,
    labelColor: 'black',
  },
};

export default function LandingPage20233() {
  return <SectionLayout {...pageConfig} />;
}
