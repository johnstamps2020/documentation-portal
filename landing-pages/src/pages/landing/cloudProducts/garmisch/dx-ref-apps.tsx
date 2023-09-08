import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import garmischBackgroundImage from 'images/background-garmisch.png';

import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${garmischBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Garmisch (2023.02)',
    items: allSelectors.se7a828d04c0ebb25f464db6df66dcc54,
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Update',
      items: [
        {
          label: 'Update Guide',
          docId: 'ee202302update',
        },
      ],
    },
    {
      label: 'Jutro Design System 8.6.1',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro861',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook861',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302ceqbdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302pedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202302verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202302veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202302veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202302vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202302verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202302',
        },
      ],
    },
  ],
};

export default function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
