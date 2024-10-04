import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: 'Seleziona il prodotto',
    selectedItemLabel: 'Guidewire Cloud Console',
    items: allSelectors.sfe3981f25d5c58ed2a73f60e2c949230,
    labelColor: 'white',
  },

  cards: [
    {
      label: '',
      items: [
        {
          label: 'Guidewire Cloud Console',
          docId: 'guidewirecloudconsolerootinsurerdevitIT',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/it-IT/gcc')({
  component: Gcc,
});

function Gcc() {
  return <CategoryLayout {...pageConfig} />;
}