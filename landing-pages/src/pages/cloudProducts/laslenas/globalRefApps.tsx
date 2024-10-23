import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url("${gradientBackgroundImage}")`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Las Leñas (2024.11)',
    items: allSelectors.sfc2c6edff3f08e7f4db564282c6812c7,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Australia',
      items: [
        {
          label: 'Getting Started with InsuranceSuite Package for Australia',
          docId: 'ipalaslenasgetstarted',
        },
        {
          label: 'Release Notes',
          docId: 'ipalaslenasrn',
        },
        {
          label: 'Application Guide',
          docId: 'ipalaslenasapp',
        },
        {
          label: 'Configuration',
          docId: 'ipalaslenasconfig',
        },
        {
          label: 'Upgrade',
          docId: 'ipalaslenasupgrade',
        },
      ],
    },
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
    {
      label: 'Japan',
      items: [
        {
          label: 'Release Notes',
          docId: 'ipjlaslenasrn',
        },
        {
          label: 'Application Guide',
          docId: 'ipjlaslenasapp',
        },
        {
          label: 'Configuration',
          docId: 'ipjlaslenasconfig',
        },
        {
          label: 'Installation',
          docId: 'ipjlaslenasinstall',
        },
      ],
    },
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
          label: 'Product Content Analyzer User Guide',
          docId: 'lobpcausercloud',
        },
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

export const Route = createFileRoute('/cloudProducts/laslenas/globalRefApps')({
  component: Globalrefapps,
});

function Globalrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
