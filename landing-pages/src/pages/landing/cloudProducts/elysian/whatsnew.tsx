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
      label: 'Elysian Release Highlights',
      items: [
        {
          label: 'Highlights Video',
          url: 'https://www.brainshark.com/1/player/guidewire?pi=zISzx7slszM6iUz0&r3f1=&fb=0',
          videoIcon: true,
        },
      ],
    },
    {
      label: 'InsuranceSuite',
      items: [
        {
          label: 'PolicyCenter Release Notes',
          docId: 'ispc202205releasenotes',
        },
        {
          label: 'ClaimCenter Release Notes',
          docId: 'iscc202205releasenotes',
        },
        {
          label: 'BillingCenter Release Notes',
          docId: 'isbc202205releasenotes',
        },
      ],
    },
    {
      label: 'InsuranceNow',
      items: [
        {
          label: 'Core Release Notes',
          docId: 'in20221rn',
        },
        {
          label: 'Release Video',
          url: 'https://www.brainshark.com/guidewire/vu?pi=zGCzZHe5LzcT3Fz0',
          videoIcon: true,
        },
        {
          label: 'Studio Release Notes',
          docId: 'in20221studiorn',
        },
        {
          label: 'Consumer Service Portal Release Notes',
          docId: 'incsp20221rn',
        },
      ],
    },
    {
      label: 'Data and Analytics',
      items: [
        {
          label: 'Cloud Data Access Release Notes',
          docId: 'clouddataaccessrn',
        },
        {
          label: 'Data Platform Release Notes',
          url: '/cloud/dataplatform/topics/c_rn-new-changed.html',
          videoIcon: false,
        },
        {
          label: 'DataHub Release Notes',
          docId: 'dhrn202205',
        },
        {
          label: 'InfoCenter Release Notes',
          docId: 'icrn202205',
        },
        {
          label: 'Explore Release Notes',
          docId: 'explorernrelease',
        },
      ],
    },
    {
      label: 'Digital',
      items: [
        {
          label: 'CustomerEngage Account Management Release Notes',
          docId: 'dx202205ceamrelnotes',
        },
        {
          label:
            'CustomerEngage Account Management for ClaimCenter Release Notes',
          docId: 'dx202205ceclaimsrelnotes',
        },
        {
          label: 'CustomerEngage Quote and Buy Release Notes',
          docId: 'dx202205ceqbrelnotes',
        },
        {
          label: 'ProducerEngage Release Notes',
          docId: 'dx202205perelnotes',
        },
        {
          label: 'ProducerEngage for ClaimCenter Release Notes',
          docId: 'dx202205peclaimsrelnotes',
        },
        {
          label: 'ServiceRepEngage Release Notes',
          docId: 'dx202205srerelnotes',
        },
        {
          label: 'VendorEngage Release Notes',
          docId: 'dx202205verelnotes',
        },
        {
          label: 'Jutro Release Notes',
          url: '/jutro/documentation/7.4.3/relnotes/r-elysian/',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Cloud Infrastructure',
      items: [
        {
          label: 'Cloud Platform Release Notes',
          docId: 'gwcpreleasenotes',
        },
      ],
    },
  ],

  searchFilters: { platform: ['Cloud'] },
};

export default function Whatsnew() {
  return <SectionLayout {...pageConfig} />;
}
