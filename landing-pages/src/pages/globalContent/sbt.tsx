import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  sections: [
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Standards-based Template Framework Guide',
          docId: 'sbtfwguide',
        },
      ],
    },
    {
      label: 'Customization',
      items: [
        {
          label: 'Standards-based Template Customization',
          docId: 'sbtfwcustomization',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/globalContent/sbt')({
  component: Sbt,
});

function Sbt() {
  return <SectionLayout {...pageConfig} />;
}
