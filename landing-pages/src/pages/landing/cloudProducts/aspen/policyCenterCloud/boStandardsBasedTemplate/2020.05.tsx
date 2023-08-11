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
          docId: 'lobbopsbtrnaspen',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Businessowners Standards Based Template Guide',
          docId: 'lobbopguideaspen',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'Businessowners Standards Based Template 2020.05',
    items: allSelectors.saf476edd868b80b4bcf23c54036f36b8,
    labelColor: 'black',
  },
};

export default function LandingPage202005() {
  return <SectionLayout {...pageConfig} />;
}
