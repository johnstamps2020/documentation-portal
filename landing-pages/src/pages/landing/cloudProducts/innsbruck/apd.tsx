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
          label: 'APD App Release Notes',
          docId: 'apdapprninnsbruck',
        },
      ],
    },
    {
      label: 'Features and functionality',
      items: [
        {
          label: 'APD App Guide',
          docId: 'apdappinnsbruck',
        },
        {
          label: 'APD App Guide (Internal)',
          docId: 'apdappinternalinnsbruck',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'APD API Reference',
          docId: 'apdmaindoc',
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          label: 'APD for Claims (Early Access)',
          docId: 'apdclaimsinnsbruck',
        },
      ],
    },
  ],
};

export default function Apd() {
  return <SectionLayout {...pageConfig} />;
}
