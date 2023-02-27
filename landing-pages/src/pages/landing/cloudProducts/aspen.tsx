import ProductFamilyLayout from "../../../components/LandingPage/ProductFamily/ProductFamilyLayout";
import { baseBackgroundProps } from "..";
import gradientBackgroundImage from "../../../images/background-gradient.svg";

const docs = [
  {
    label: "PolicyCenter Cloud",
    pagePath: "cloudProducts/aspen/policyCenterCloud",
  },
  {
    label: "ClaimCenter Cloud",
    pagePath: "cloudProducts/aspen/claimCenterCloud",
  },
  {
    label: "BillingCenter Cloud",
    pagePath: "cloudProducts/aspen/billingCenterCloud",
  },
  {
    label: "InsuranceNow",
    pagePath: "cloudProducts/aspen/insuranceNow/2020.1",
  },
  {
    label: "Guidewire Cloud Platform",
    pagePath: "cloudProducts/guidewireCloudPlatform",
  },
];

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
