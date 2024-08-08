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
    selectedItemLabel: 'Las Leñas (2024.11)',
    items: allSelectors.sfc2c6edff3f08e7f4db564282c6812c7,
    labelColor: 'white',
  },

  cards: [
    // {
    //   label: 'Australia',
    //   items: [
    //     {
    //       label: 'Getting Started with InsuranceSuite Package for Australia',
    //       docId: 'ipakufrigetstarted',
    //     },
    //     {
    //       label: 'Release Notes',
    //       docId: 'ipakufrirn',
    //     },
    //     {
    //       label: 'Application Guide',
    //       docId: 'ipakufriapp',
    //     },
    //     {
    //       label: 'Configuration',
    //       docId: 'ipakufriconfig',
    //     },
    //     {
    //       label: 'Installation',
    //       docId: 'ipakufriinstall',
    //     },
    //     {
    //       label: 'Upgrade',
    //       docId: 'ipakufriupgrade',
    //     },
    //   ],
    // },
    {
      label: 'Germany',
      items: [
        {
          label: 'Release Notes',
          docId: 'midipglaslenasrnen',
        },
        {
          label: 'Release Notes (German)',
          docId: 'midipglaslenasrnde',
        },
        {
          label: 'Application Guide',
          docId: 'midipglaslenasapp',
        },
        {
          label: 'Application Guide (German)',
          docId: 'midipglaslenasappde',
        },
        {
          label: 'Implementation',
          docId: 'midipglaslenasimpl',
        },
        {
          label: 'Installation',
          docId: 'midipglaslenasinstall',
        },
        {
          label: 'Glossary',
          docId: 'midipglaslenasglossary',
        },
      ],
    },
    // {
    //   label: 'Japan',
    //   items: [
    //     {
    //       label: 'Release Notes',
    //       docId: 'ipjkufrirn',
    //     },
    //     {
    //       label: 'Application Guide',
    //       docId: 'ipjkufriapp',
    //     },
    //     {
    //       label: 'Configuration',
    //       docId: 'ipjkufriconfig',
    //     },
    //     {
    //       label: 'Installation',
    //       docId: 'ipjkufriinstall',
    //     },
    //   ],
    // },
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonlaslenasrn',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonlaslenasccapp',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonlaslenaspcapp',
        },
        {
          label: 'Configuration',
          docId: 'londonlaslenasconfig',
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
