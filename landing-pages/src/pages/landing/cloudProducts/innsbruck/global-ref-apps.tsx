import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.sfc2c6edff3f08e7f4db564282c6812c7,
    labelColor: 'white',
  },
  searchFilters: { platform: ['Cloud'] },

  cards: [
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonrninnsbruck',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccappinnsbruck',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcappinnsbruck',
        },
        {
          label: 'Configuration',
          docId: 'londonconfiginnsbruck',
        },
      ],
    },
    {
      label: 'US Standards-based Template Framework',
      items: [
        {
          label: 'Standards-based Template Framework Guide',
          docId: 'sbtfwguide',
        },
        {
          label: 'Standards-based Template Customization',
          docId: 'sbtfwcustomization',
        },
      ],
    },
  ],
};

export default function Globalrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
