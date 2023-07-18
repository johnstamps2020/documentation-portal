import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import hakubaBackgroundImage from 'images/background-hakuba.svg';

import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${hakubaBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba (2023.06)',
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
          docId: 'ipahakubarn',
        },
        {
          label: 'Application Guide',
          docId: 'ipahakubaapp',
        },
        {
          label: 'Configuration',
          docId: 'ipahakubaconfig',
        },
        {
          label: 'Installation',
          docId: 'ipahakubainstall',
        },
        {
          label: 'Upgrade',
          docId: 'ipahakubaupgrade',
        },
      ],
    },
    {
      label: 'Japan',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipjhakubarn',
        },
        {
          label: 'Application Guide',
          docId: 'ipjhakubaapp',
        },
        {
          label: 'Configuration',
          docId: 'ipjhakubaconfig',
        },
        {
          label: 'Installation',
          docId: 'ipjhakubainstall',
        },
      ],
    },
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonrnhakuba',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccapphakuba',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcapphakuba',
        },
        {
          label: 'Configuration',
          docId: 'londonconfighakuba',
        },
      ],
    },
    {
      label: 'UK Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipukhakubarn',
        },
        {
          label: 'Application Guide',
          docId: 'ipukhakubaapp',
        },
        {
          label: 'Configuration',
          docId: 'ipukhakubaconfig',
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
