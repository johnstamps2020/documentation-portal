import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  sections: [
    {
      label: 'Release Notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'dhcloudrncortina',
        },
        {
          label: 'Log4j Patch Release Notes',
          url: '/dm/dh/DH2021_04_Patch3_ReleaseNotes.html',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Product Guide',
          docId: 'dhcloudproductcortina',
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Installation Guide',
          docId: 'dhcloudinstallcortina',
        },
        {
          label: 'Upgrade Guide',
          docId: 'dhcloudupgradecortina',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'dhcloudconfigcortina',
        },
        {
          label: 'Data Specifications Guide',
          docId: 'dhclouddataspeccortina',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Administration Guide',
          docId: 'dhcloudadmincortina',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Developer Reference',
          docId: 'dhclouddevrefcortina',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'DataHub for Guidewire Cloud 2021.04',
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
