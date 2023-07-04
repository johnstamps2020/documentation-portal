import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';

import flaineBackgroundImage from 'images/background-flaine.png';
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
        pagePath: 'cloudProducts/flaine/dx-ref-apps',
      },
      {
        label: 'Garmisch (2023.02)',
        pagePath: 'cloudProducts/garmisch/dx-ref-apps',
      },
      {
        label: 'Hakuba (2023.06)',
        pagePath: 'cloudProducts/hakuba/dx-ref-apps',
      },
    ],
    labelColor: 'white',
  },

  cards: [
    {
      label: 'Jutro Design System 8.3.0',
      items: [
        {
          label: 'Jutro Design System and UI Framework',
          docId: 'jutro830',
        },
        {
          label: 'Jutro Storybook',
          docId: 'storybook830',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209ceqbdev',
        },
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202209dcg',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209pedev',
        },
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202209dcg',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes',
          docId: 'dx202209verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202209veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202209veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202209vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202209verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202209',
        },
      ],
    },
  ],
};

export default function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
