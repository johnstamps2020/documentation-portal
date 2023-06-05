import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
  },

  cards: [
    {
      label: 'Cyence Cyber',
      items: [
        {
          label: 'Help Center',
          url: '/cyence/cyber/HelpCenter',
          videoIcon: false,
        },
        {
          label: 'Help Center - Accumulation Only',
          url: '/cyence/cyber/HelpCenterAccum',
          videoIcon: false,
        },
        {
          label: 'Model 5 Technical Reference',
          url: '/cyence/cyber/Model5/CyenceCyberRiskModel5.pdf',
          videoIcon: false,
        },
        {
          label: 'Python SDK and REST API Reference',
          url: '/cyence/cyber/SdkApiRef',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Cyence Cyber for Small/Medium Business',
      items: [
        {
          label: 'C#/Python SDKs and REST API Reference',
          url: '/cyence/smb/SdkApiRef',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cyence() {
  return <CategoryLayout {...pageConfig} />;
}
