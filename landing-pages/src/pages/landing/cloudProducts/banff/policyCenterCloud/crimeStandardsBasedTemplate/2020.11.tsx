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
          label: 'Release Notes',
          docId: 'lobcrimesbtrnbanff',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Crime Standards Based Template Guide',
          docId: 'lobcrimeguidebanff',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'Crime Standards Based Template 2020.11',
    items: allSelectors.sbb8893cab6b5c143572861725d4d04fc,
    labelColor: 'black',
  },
};

export default function LandingPage202011() {
  return <SectionLayout {...pageConfig} />;
}
