import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { allSelectors } from 'components/allSelectors';

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
          label: 'Core Release Notes',
          docId: 'in20202rn',
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20202studiorn',
        },
        {
          label: 'Consumer Service Portal 3.26 Release Notes',
          docId: 'incsp326rn',
        },
        {
          label: 'Consumer Service Portal 3.25 Release Notes',
          docId: 'incsp325rn',
        },
        {
          label: 'Consumer Service Portal 3.24 Release Notes',
          docId: 'incsp324rn',
        },
        {
          label: 'Consumer Service Portal 3.23 Release Notes',
          docId: 'incsp323rn',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Application Guide',
          docId: 'in20202app',
        },
        {
          label: 'Business Intelligence Getting Started Guide',
          docId: 'in20202bi',
        },
        {
          label: 'Consumer Sales Portal Features',
          docId: 'in20202csalesp',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20202cservicep',
        },
        {
          label: 'Excel Designed Rating',
          docId: 'inexcelrating23',
        },
      ],
    },
    {
      label: 'Integration',
      items: [
        {
          label: 'AppReader Integration',
          docId: 'in20202appreaderinteg',
        },
        {
          label: 'Predictive Analytics Integration',
          docId: 'in20202pa',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration Guide',
          docId: 'in20202config',
        },
        {
          label: 'Studio Configuration Guide',
          docId: 'in20202studio',
        },
        {
          label: 'Product Attribute Reference',
          docId: 'in20202prodattref',
        },
        {
          label: 'Portal Development',
          docId: 'in20202portaldev',
        },
      ],
    },
  ],
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Banff (2020.2)',
    items: allSelectors.s8f0ef4ce7f1a0e901c8b8c38ba2d3ca1,
    labelColor: 'black',
  },
};

export default function LandingPage20202() {
  return <SectionLayout {...pageConfig} />;
}
