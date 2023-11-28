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
  selector: {
    label: 'Select cloud release',
    selectedItemLabel: 'Innsbruck (2023.10)',
    items: allSelectors.apdApp,
    labelColor: 'black',
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
          label: 'Creating Products with APD App',
          docId: 'apdcreatingproductsinnsbruck',
        },
        {
          label: 'Integrating Products with PolicyCenter',
          docId: 'apdfinalizingproductsinnsbruck',
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
