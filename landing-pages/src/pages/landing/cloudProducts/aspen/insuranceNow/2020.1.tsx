import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
          docId: 'in20201rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zHUzBobpCzM6iUz0',
          videoIcon: true,
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20201studiorn',
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
          label: 'Business Intelligence Getting Started Guide',
          docId: 'in20201bi',
        },
        {
          label: 'Consumer Service Portal Features',
          docId: 'in20201cservicep',
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
          docId: 'in20201appreaderinteg',
        },
        {
          label: 'Predictive Analytics Integration',
          docId: 'in20201pa',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'Core Configuration Guide',
          docId: 'in20201config',
        },
        {
          label: 'Studio Configuration Guide',
          docId: 'in20201studio',
        },
        {
          label: 'Portal Development',
          docId: 'in20201portaldev',
        },
      ],
    },
  ],
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Aspen (2020.1)',
    items: allSelectors.sb93ea0f8d0fc172dd24c8ce25d379ff9,
    labelColor: 'black',
  },
};

export default function LandingPage20201() {
  return <SectionLayout {...pageConfig} />;
}
