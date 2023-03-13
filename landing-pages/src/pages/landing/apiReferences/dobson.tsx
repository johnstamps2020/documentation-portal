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
        label: 'Dobson',
        pagePath: '',
      },
      {
        label: 'Flaine',
        pagePath: 'apiReferences/flaine',
      },
      {
        label: 'Elysian',
        pagePath: 'apiReferences/elysian',
      },
      {
        label: 'Cortina',
        pagePath: 'apiReferences/cortina',
      },
      {
        label: 'Banff',
        pagePath: 'apiReferences/banff',
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

  sidebar: {
    label: 'Implementation Resources',
    items: [
      {
        label: 'API References',
        pagePath: 'apiReferences',
      },
      {
        label: 'Community Case Templates',
        docId: 'cloudtickettemplates',
      },
      {
        label: 'Product Adoption',
        docId: 'surepathmethodologymain',
      },
      {
        label: 'Cloud Standards',
        docId: 'standardslatest',
      },
      {
        label: 'Upgrade Diff Reports',
        pagePath: 'upgradediffs',
      },
    ],
  },
};

export default function Dobson() {
  return <CategoryLayout {...pageConfig} />;
}
