import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'dhrn202302',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dhproduct202302',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dhinstall202302',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dhupgrade202302',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dhconfig202302',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dhdataspec202302',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dhadmin202302',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dhdevref202302',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'DataHub for Guidewire Cloud 2023.02',
    items: [
      {
        label: 'DataHub for Guidewire Cloud 2023.02',
        pagePath: '',
      },
      {
        label: 'InfoCenter for Guidewire Cloud 2023.02',
        pagePath: 'cloudProducts/garmisch/icGwCloud/2023.02',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202302() {
  return <SectionLayout {...pageConfig} />;
}
