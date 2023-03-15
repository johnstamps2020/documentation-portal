import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import dobsonBackgroundImage from 'images/background-dobson.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `url(${dobsonBackgroundImage})`,
    },
  },
  selector: {
    label: 'Select release',
    selectedItemLabel: 'Dobson',
    items: [
      {
        label: 'Banff',
        pagePath: 'apiReferences/banff',
      },
      {
        label: 'Cortina',
        pagePath: 'apiReferences/cortina',
      },
      {
        label: 'Dobson',
        pagePath: 'apiReferences/dobson',
      },
      {
        label: 'Elysian',
        pagePath: 'apiReferences/elysian',
      },
      {
        label: 'Flaine',
        pagePath: 'apiReferences/flaine',
      },
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'InsuranceNow API Reference',
    },
    {
      label: 'ClaimCenter API Reference',
    },
    {
      label: 'PolicyCenter API Reference',
    },
  ],
};

export default function Dobson() {
  return <CategoryLayout {...pageConfig} />;
}
