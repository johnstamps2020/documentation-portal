import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  cards: [
    {
      label: '10.0.0',
      items: [
        {
          label: 'Guida alle applicazioni BI',
          url: '/l10n/it-IT/ic/10.0.0/IC10-bi-applications-it.pdf',
          videoIcon: false,
        },
        {
          label: 'Guida alle Specifiche dati',
          url: '/l10n/it-IT/ic/10.0.0/IC10-dataspec-it.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Ic() {
  return <CategoryLayout {...pageConfig} />;
}
