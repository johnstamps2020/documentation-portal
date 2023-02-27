import ProductFamilyLayout from '../../../components/LandingPage/ProductFamily/ProductFamilyLayout';
import { baseBackgroundProps } from '..';
import gradientBackgroundImage from '../../../images/background-gradient.svg';
import { CategoryLayout2Props } from '../../../components/LandingPage/Category/CategoryLayout2';

const docs = [
  {
    label: 'PolicyCenter Cloud',
    pagePath: 'cloudProducts/aspen/policyCenterCloud',
  },
  {
    label: 'ClaimCenter Cloud',
    pagePath: 'cloudProducts/aspen/claimCenterCloud',
  },
  {
    label: 'BillingCenter Cloud',
    pagePath: 'cloudProducts/aspen/billingCenterCloud',
  },
  {
    label: 'InsuranceNow',
    pagePath: 'cloudProducts/aspen/insuranceNow/2020.1',
  },
  {
    label: 'Guidewire Cloud Platform',
    pagePath: 'cloudProducts/guidewireCloudPlatform',
  },
];

const sidebar: CategoryLayout2Props['sidebar'] = {
  label: 'Implementation Resources',
  items: [
    {
      label: 'Community Case Templates',
      docId: 'cloudtickettemplates',
    },
    {
      label: 'Product Adoption',
      docId: 'surepathmethodologymain',
    },
    {
      label: 'Cloud Standards',
      docId: 'standardslatest',
    },
    {
      label: 'Upgrade Diff Reports',
      pagePath: 'upgradediffs',
    },
    {
      label: 'Internal docs',
      docId: 'internaldocslatest',
    },
  ],
};

export default function Aspen() {
  return (
    <ProductFamilyLayout
      backgroundProps={{
        ...baseBackgroundProps,
        backgroundImage: `url(${gradientBackgroundImage})`,
      }}
      items={docs}
    />
  );
}
