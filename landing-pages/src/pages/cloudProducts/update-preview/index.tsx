import { createFileRoute } from '@tanstack/react-router';
import Category2Layout, {
  Category2LayoutProps,
} from 'components/LandingPage/Category2/Category2Layout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import gradientBackgroundImage from 'images/background-gradient.svg';
import backgroundImage from 'images/background-kufri.png';

const pageConfig: Category2LayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundAttachment: 'scroll',
    backgroundImage: {
      xs: `url(${gradientBackgroundImage})`,
      sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${backgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
    },
  },
  isRelease: false,
  headerText: 'Las Leñas Update Preview',
  subHeaderText: `These documents are provided as part of the Guidewire Update Preview program to help you start planning updates before a release is generally available. The Update Preview program is not a binding commitment to deliver any specific functionality. Guidewire might make functional updates, resolve issues, or adjust the contents of the release before the general availability date. Please review the latest release notes and Documentation when the release is generally available.`,

  cards: [
    {
      label: 'Prerelease Release Notes',
      items: [
        {
          label: 'InsuranceSuite',
          docId: 'isrnlatestpreview',
        },
        {
          label: 'CustomerEngage Account Management',
          docId: 'dx202411ceamrelnotes',
        },
        {
          label: 'CustomerEngage Account Management for ClaimCenter',
          docId: 'dx202411ceclaimsrelnotes',
        },
        {
          label: 'CustomerEngage Quote and Buy',
          docId: 'dx202411ceqbrelnotes',
        },
        {
          label: 'ProducerEngage',
          docId: 'dx202411perelnotes',
        },
        {
          label: 'ProducerEngage for ClaimCenter',
          docId: 'dx202411peclaimsrelnotes',
        },
        {
          label: 'ServiceRepEngage',
          docId: 'dx202411srerelnotes',
        },
        {
          label: 'VendorEngage',
          docId: 'dx202411verelnotes',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/update-preview/')({
  component: LasLenas,
});

export default function LasLenas() {
  return <Category2Layout {...pageConfig} />;
}
