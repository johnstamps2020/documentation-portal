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
          docId: 'lobwcsbtrnbanff',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Workers Compensation Standards Based Template Guide',
          docId: 'lobwcguidebanff',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'Workers Compensation Standards Based Template 2020.11',
    items: [
      {
        label: 'Businessowners Standards Based Template 2020.11',
        pagePath:
          'cloudProducts/banff/policyCenterCloud/boStandardsBasedTemplate/2020.11',
      },
      {
        label: 'Commercial Auto Standards Based Template 2020.11',
        pagePath:
          'cloudProducts/banff/policyCenterCloud/caStandardsBasedTemplate/2020.11',
      },
      {
        label: 'Crime Standards Based Template 2020.11',
        pagePath:
          'cloudProducts/banff/policyCenterCloud/crimeStandardsBasedTemplate/2020.11',
      },
      {
        label: 'General Liability Standards Based Template 2020.11',
        pagePath:
          'cloudProducts/banff/policyCenterCloud/glStandardsBasedTemplate/2020.11',
      },
      {
        label: 'Workers Compensation Standards Based Template 2020.11',
        pagePath:
          'cloudProducts/banff/policyCenterCloud/wcStandardsBasedTemplate/2020.11',
      },
    ],
    labelColor: 'black',
  },
};

export default function LandingPage202011() {
  return <SectionLayout {...pageConfig} />;
}
