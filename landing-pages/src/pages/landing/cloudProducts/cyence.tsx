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
          docId: 'cyence',
          pathInDoc: 'cyber/HelpCenter',
          videoIcon: false,
        },
        {
          label: 'Help Center - Accumulation Only',
          docId: 'cyence',
          pathInDoc: 'cyber/HelpCenterAccum',
          videoIcon: false,
        },
        {
          label: 'Risk Model Technical Reference',
          docId: 'cyence',
          pathInDoc: 'cyber/Model/RiskModelTechRef.pdf',
          videoIcon: false,
        },
        {
          label: 'Python SDK and REST API Reference',
          docId: 'cyence',
          pathInDoc: 'cyber/SdkApiRef',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Cyence Cyber for Small/Medium Business',
      items: [
        {
          label: 'C#/Python SDKs and REST API Reference',
          docId: 'cyence',
          pathInDoc: 'smb/SdkApiRef',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cyence() {
  return <CategoryLayout {...pageConfig} />;
}
