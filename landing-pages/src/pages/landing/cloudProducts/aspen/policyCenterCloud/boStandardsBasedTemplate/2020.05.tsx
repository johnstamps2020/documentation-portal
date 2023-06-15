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
          docId: 'lobbopsbtrnaspen',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Businessowners Standards Based Template Guide',
          docId: 'lobbopguideaspen',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'Businessowners Standards Based Template 2020.05',
    items: [
      {
        label: 'Businessowners Standards Based Template 2020.05',
        pagePath:
          'cloudProducts/aspen/policyCenterCloud/boStandardsBasedTemplate/2020.05',
      },
      {
        label: 'Commercial Auto Standards Based Template 2020.05',
        pagePath:
          'cloudProducts/aspen/policyCenterCloud/caStandardsBasedTemplate/2020.05',
      },
      {
        label: 'Crime Standards Based Template 2020.05',
        pagePath:
          'cloudProducts/aspen/policyCenterCloud/crimeStandardsBasedTemplate/2020.05',
      },
      {
        label: 'General Liability Standards Based Template 2020.05',
        pagePath:
          'cloudProducts/aspen/policyCenterCloud/glStandardsBasedTemplate/2020.05',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202005() {
  return <SectionLayout {...pageConfig} />;
}
