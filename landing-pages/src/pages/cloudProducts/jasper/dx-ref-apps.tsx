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
    selectedItemLabel: 'Jasper (2024.02)',
    items: allSelectors.se7a828d04c0ebb25f464db6df66dcc54,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Update',
      items: [
        {
          label: 'Update Guide',
          docId: 'ee202402update',
        },
      ],
    },
    {
      label: 'Jutro Design System 10.0.3',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro1000',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook1003',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202402verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202402veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202402veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202402vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202402verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202402',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/jasper/dx-ref-apps')({
  component: Dxrefapps,
});

function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
