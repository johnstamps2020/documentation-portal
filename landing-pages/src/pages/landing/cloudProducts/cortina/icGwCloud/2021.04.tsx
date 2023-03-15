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
          docId: 'iccloudrncortina',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'iccloudproductcortina',
        },
        {
          label: 'BI Applications Guide',
          docId: 'iccloudbiappcortina',
        },
        {
          label: 'Reports Guide',
          docId: 'iccloudreportscortina',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'iccloudinstallcortina',
        },
        {
          label: 'Upgrade Guide',
          docId: 'iccloudupgradecortina',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'iccloudconfigcortina',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'icclouddataspeccortina',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'iccloudadmincortina',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'icclouddevrefcortina',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'InfoCenter for Guidewire Cloud 2021.04',
    items: [
      {
        label: 'DataHub for Guidewire Cloud 2021.04',
        pagePath: 'cloudProducts/cortina/dhGwCloud/2021.04',
      },
      {
        label: 'InfoCenter for Guidewire Cloud 2021.04',
        pagePath: 'cloudProducts/cortina/icGwCloud/2021.04',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202104() {
  return <SectionLayout {...pageConfig} />;
}
