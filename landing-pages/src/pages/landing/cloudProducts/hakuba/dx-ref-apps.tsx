import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import hakubaBackgroundImage from 'images/background-hakuba.svg';

import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${hakubaBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Hakuba (2023.06)',
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
      label: 'Update',
      items: [
        {
          label: 'Update Guide',
          docId: 'ee202306update',
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
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306ceamrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306ceaminstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306ceamapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306ceamdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306ceamrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Account Management for ClaimCenter',
      items: [
        {
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306ceclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306ceclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306ceclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306ceclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306ceclaimsrefguides',
        },
      ],
    },
    {
      label: 'CustomerEngage Quote and Buy',
      items: [
        {
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306ceqbrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306ceqbinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306ceqbapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306ceqbdev',
        },
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202306dcg',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306ceqbrefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage',
      items: [
        {
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306perelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306peinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306peapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306pedev',
        },
        {
          label: 'Digital Code Generation Guide',
          docId: 'dx202306dcg',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306perefguides',
        },
      ],
    },
    {
      label: 'ProducerEngage for ClaimCenter',
      items: [
        {
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306peclaimsrelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306peclaimsinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306peclaimsapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306peclaimsdev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306peclaimsrefguides',
        },
      ],
    },
    {
      label: 'ServiceRepEngage',
      items: [
        {
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306srerelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306sreinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306sreapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306sredev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306srerefguides',
        },
      ],
    },
    {
      label: 'VendorEngage',
      items: [
        {
          label: 'Release Notes (Prerelease)',
          docId: 'dx202306verelnotes',
        },
        {
          label: 'Installation Guide',
          docId: 'dx202306veinstall',
        },
        {
          label: 'Application Guide',
          docId: 'dx202306veapp',
        },
        {
          label: "Developer's Guide",
          docId: 'dx202306vedev',
        },
        {
          label: 'Digital Services Reference Guides',
          docId: 'dx202306verefguides',
        },
      ],
    },
    {
      label: 'API Documentation',
      items: [
        {
          label: 'Digital Frontend API Documentation',
          docId: 'dxjsdocs202306',
        },
      ],
    },
  ],
};

export default function Dxrefapps() {
  return <CategoryLayout {...pageConfig} />;
}
