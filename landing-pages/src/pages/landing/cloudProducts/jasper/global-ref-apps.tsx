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
    selectedItemLabel: 'Jasper (2024.02)',
    items: allSelectors.sfc2c6edff3f08e7f4db564282c6812c7,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Australia',
      items: [
        {
          label: 'Getting Started with InsuranceSuite Package for Australia',
          docId: 'ipajaspergetstarted',
        },
        {
          label: 'Release Notes',
          docId: 'ipajasperrn',
        },
        {
          label: 'Application Guide',
          docId: 'ipajasperapp',
        },
        {
          label: 'Configuration',
          docId: 'ipajasperconfig',
        },
        {
          label: 'Upgrade',
          docId: 'ipajasperupgrade',
        },
      ],
    },
    {
      label: 'London Market',
      items: [
        {
          label: 'Release Notes',
          docId: 'londonrnjasper',
        },
        {
          label: 'ClaimCenter for London Market Application Guide',
          docId: 'londonccappjasper',
        },
        {
          label: 'PolicyCenter for London Market Application Guide',
          docId: 'londonpcappjasper',
        },
        {
          label: 'Configuration',
          docId: 'londonconfigjasper',
        },
      ],
    },
    {
      label: 'Japan',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipjjasperrn',
        },
        {
          label: 'Application Guide',
          docId: 'ipjjasperapp',
        },
        {
          label: 'Configuration',
          docId: 'ipjjasperconfig',
        },
        {
          label: 'Installation',
          docId: 'ipjjasperinstall',
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
