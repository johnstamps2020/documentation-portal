import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import flaineBadge from 'images/badge-flaine.svg';
import flaineBackgroundImage from 'images/background-flaine.svg';
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
          label: 'Digital Code Generation Guide',
          docId: 'dx202302dcg',
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
          label: 'Digital Code Generation Guide',
          docId: 'dx202302dcg',
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
