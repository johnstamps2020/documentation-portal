import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import garmischBackgroundImage from 'images/background-garmisch.png';
import garmischBadge from 'images/badge-garmisch.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${garmischBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },

  cards: [
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonrngarmisch',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccappgarmisch',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcappgarmisch',
        },
        {
          label: 'Configuration Guide',
          docId: 'londonconfiggarmisch',
        },
      ],
    },
  ],

  sidebar: {
    label: 'Implementation Resources',
    items: [
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
      {
        label: 'Internal docs',
        docId: 'internaldocslatest',
      },
    ],
  },
};

export default function Globalrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
