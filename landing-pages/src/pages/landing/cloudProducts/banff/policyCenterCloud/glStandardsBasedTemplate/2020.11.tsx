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
          docId: 'lobglsbtrnbanff',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'General Liability Standards Based Template Guide',
          docId: 'lobglguidebanff',
        },
      ],
    },
  ],
  selector: {
    label: 'Select product',
    selectedItemLabel: 'General Liability Standards Based Template 2020.11',
    items: [
      {
        label: 'General Liability Standards Based Template 2020.11',
        pagePath: '',
      },
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
