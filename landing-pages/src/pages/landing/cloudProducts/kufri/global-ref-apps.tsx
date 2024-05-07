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
    selectedItemLabel: 'Kufri (2024.07)',
    items: allSelectors.sfc2c6edff3f08e7f4db564282c6812c7,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Australia',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipakufrirn',
        },
        {
          label: 'Application Guide',
          docId: 'ipakufriapp',
        },
        {
          label: 'Configuration',
          docId: 'ipakufriconfig',
        },
        {
          label: 'Installation',
          docId: 'ipakufriinstall',
        },
        {
          label: 'Upgrade',
          docId: 'ipakufriupgrade',
        },
      ],
    },
    {
      label: 'Germany',
      items: [
        {
          label: 'Release Notes',
          docId: 'midipgkufrirnen',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipgkufrirnde',
        },
        {
          label: 'Application Guide',
          docId: 'midipgkufriapp',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipgkufriappde',
        },
        {
          label: 'Implementation',
          docId: 'midipgkufriimpl',
        },
        {
          label: 'Installation',
          docId: 'midipgkufriinstall',
        },
        {
          label: 'Glossary',
          docId: 'midipgkufriglossary',
        },
      ],
    },
    {
      label: 'Japan',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipjkufrirn',
        },
        {
          label: 'Application Guide',
          docId: 'ipjkufriapp',
        },
        {
          label: 'Configuration',
          docId: 'ipjkufriconfig',
        },
        {
          label: 'Installation',
          docId: 'ipjkufriinstall',
        },
      ],
    },
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonkufrirn',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonkufriccapp',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonkufripcapp',
        },
        {
          label: 'Configuration',
          docId: 'londonkufriconfig',
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
