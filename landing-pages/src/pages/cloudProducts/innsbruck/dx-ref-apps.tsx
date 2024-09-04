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
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.se7a828d04c0ebb25f464db6df66dcc54,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Update',
      items: [
        {
          label: 'Update Guide',
          docId: 'ee202310update',
        },
      ],
    },
    {
      label: 'Jutro Design System 8.13.2',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro8132',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook8132',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202310verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202310veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202310veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202310vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202310verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202310',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/innsbruck/dx-ref-apps')({
  component: Dxrefapps,
});

function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
