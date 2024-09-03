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
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Kufri (2024.07)',
    items: allSelectors.se7a828d04c0ebb25f464db6df66dcc54,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Update',
      items: [
        {
          label: 'Update Guide',
          docId: 'ee202407update',
        },
      ],
    },
    {
      label: 'Jutro Design System 10.3.3',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro1030',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook1033',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202407verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202407veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202407veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202407vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202407verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202407',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/kufri/dx-ref-apps')({
  component: Dxrefapps,
});

function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
