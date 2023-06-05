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
      label: 'Staging site',
      items: [
        {
          label: 'https://docs.staging.ccs.guidewire.net/',
          url: 'https://docs.staging.ccs.guidewire.net/',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Production site',
      items: [
        {
          label: 'https://docs.guidewire.com/',
          url: 'https://docs.guidewire.com/',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Intdeprecated() {
  return <SectionLayout {...pageConfig} />;
}
