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
        },
        {
          label: 'Help Center - Accumulation Only',
          url: '/cyence/cyber/HelpCenterAccum',
        },
        {
          label: 'Model 5 Technical Reference',
          url: '/cyence/cyber/Model5/CyenceCyberRiskModel5.pdf',
        },
        {
          label: 'Python SDK and REST API Reference',
          url: '/cyence/cyber/SdkApiRef',
        },
      ],
    },
    {
      label: 'Cyence Cyber for Small/Medium Business',
      items: [
        {
          label: 'C#/Python SDKs and REST API Reference',
          url: '/cyence/smb/SdkApiRef',
        },
      ],
    },
  ],
};

export default function Cyence() {
  return <CategoryLayout {...pageConfig} />;
}
