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
          docId: 'midipfrn20',
        },
        {
          label: 'Release Notes - French',
          docId: 'midipfrn20frFR',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Overview',
          docId: 'midipfoverview20',
        },
        {
          label: 'Adjuster Guide',
          docId: 'midipfadjuster20',
        },
        {
          label: 'Adjuster Guide - French',
          docId: 'midipfadjuster20frFR',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'midipfadmin20',
        },
      ],
    },
  ],
};

export default function LandingPage20() {
  return <SectionLayout {...pageConfig} />;
}
