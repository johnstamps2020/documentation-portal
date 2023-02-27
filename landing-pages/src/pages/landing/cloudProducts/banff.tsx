import { baseBackgroundProps } from '..';
import ProductFamilyLayout from '../../../components/LandingPage/ProductFamily/ProductFamilyLayout';
import gradientBackgroundImage from '../../../images/background-gradient.svg';
import banffBackgroundImage from '../../../images/background-banff.svg';

const docs = [
  {
    label: 'PolicyCenter Cloud',
    pagePath: 'cloudProducts/banff/policyCenterCloud',
  },
  {
    label: 'ClaimCenter Cloud',
    pagePath: 'cloudProducts/banff/claimCenterCloud',
  },
  {
    label: 'BillingCenter Cloud',
    pagePath: 'cloudProducts/banff/billingCenterCloud',
  },
  {
    label: 'InsuranceNow',
    pagePath: 'cloudProducts/banff/insuranceNow/2020.2',
  },
  {
    label: 'Guidewire Cloud Platform',
    pagePath: 'cloudProducts/guidewireCloudPlatform',
  },
  {
    label: 'Integration Framework',
    docId: 'isrestapiclientguide',
  },
];

export default function Banff() {
  return (
    <ProductFamilyLayout
      backgroundProps={{
        ...baseBackgroundProps,
        backgroundImage: {
          sm: `url(${banffBackgroundImage}), url(${gradientBackgroundImage})`,
          xs: `url(${gradientBackgroundImage})`,
        },
      }}
      items={docs}
    />
  );
}
