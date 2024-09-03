import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';

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
          docId: 'ipacloud10rn',
        },
      ],
    },
    {
      label: 'Developers',
      items: [
        {
          label: 'Configuration Guide',
          docId: 'ipacloud10config',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'Australia Personal Motor Policy',
          docId: 'ipacloud10apmp',
        },
        {
          label: 'Australia Personal Motor Claims',
          docId: 'ipacloud10apmc',
        },
        {
          label: 'GST for Claims',
          docId: 'ipacloud10gstc',
        },
        {
          label: 'Address Lookup',
          docId: 'ipacloud10al',
        },
        {
          label: 'Vehicle Lookup',
          docId: 'ipacloud10vl',
        },
      ],
    },
  ],
};

export default function LandingPage10() {
  return <SectionLayout {...pageConfig} />;
}
