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
    items: allSelectors.se7a828d04c0ebb25f464db6df66dcc54,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Update',
      items: [
        {
          label: 'Update Guide',
          docId: 'ee202411update',
        },
      ],
    },
    {
      label: 'Jutro Design System 10.9.0',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro1090',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook1090',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202411verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202411veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202411veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202411vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202411verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202411',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/laslenas/dx-ref-apps')({
  component: Dxrefapps,
});

function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
