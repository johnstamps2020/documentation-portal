import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';

import flaineBackgroundImage from 'images/background-flaine.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Flaine (2022.09)',
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
          docId: 'ipaflainern',
        },
        {
          label: 'Application Guide',
          docId: 'ipaflaineapp',
        },
        {
          label: 'Configuration Guide',
          docId: 'ipaflaineconfig',
        },
      ],
    },
    {
      label: 'Japan',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipjflainern',
        },
        {
          label: 'Application Guide',
          docId: 'ipjflaineapp',
        },
        {
          label: 'Configuration Guide',
          docId: 'ipjflaineconfig',
        },
      ],
    },
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonrnflaine',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccappflaine',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcappflaine',
        },
        {
          label: 'Configuration Guide',
          docId: 'londonconfigflaine',
        },
      ],
    },
    {
      label: 'UK Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipukflainern',
        },
        {
          label: 'Application Guide',
          docId: 'ipukflaineapp',
        },
        {
          label: 'Configuration',
          docId: 'ipukflaineconfig',
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
