import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: '10.0.2',
      items: [
        {
          label: 'Guidewire Contact Management Guide',
          docId: 'l10npdfss3folder',
          pathInDoc: 'nl-NL/cc/10.0.2/nl-CC-ContactMgmtGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/nl-NL/cc')({
  component: Cc,
});

function Cc() {
  return <CategoryLayout {...pageConfig} />;
}
