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
