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
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Garmisch (2023.02)',
    items: [
      {
        label: 'Flaine (2022.09)',
        pagePath: 'cloudProducts/flaine/global-ref-apps',
      },
      {
        label: 'Garmisch (2023.02)',
        pagePath: 'cloudProducts/garmisch/global-ref-apps',
      },
      {
        label: 'Hakuba (2023.06)',
        pagePath: 'cloudProducts/hakuba/global-ref-apps',
      },
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Australia',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipagarmischrn',
        },
        {
          label: 'Application Guide',
          docId: 'ipagarmischapp',
        },
        {
          label: 'Configuration',
          docId: 'ipagarmischconfig',
        },
        {
          label: 'Installation',
          docId: 'ipagarmischinstall',
        },
        {
          label: 'Upgrade',
          docId: 'ipagarmischupgrade',
        },
      ],
    },
    {
      label: 'Japan',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipjgarmischrn',
        },
        {
          label: 'Application Guide',
          docId: 'ipjgarmischapp',
        },
        {
          label: 'Configuration',
          docId: 'ipjgarmischconfig',
        },
        {
          label: 'Installation',
          docId: 'ipjgarmischinstall',
        },
      ],
    },
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
          label: 'Configuration',
          docId: 'londonconfiggarmisch',
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
