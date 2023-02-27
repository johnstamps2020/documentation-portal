import { baseBackgroundProps } from "..";
import ProductFamilyLayout from "../../../components/LandingPage/ProductFamily/ProductFamilyLayout";
import cortinaBackgroundImage from "../../../images/background-cortina.svg";
import gradientBackgroundImage from "../../../images/background-gradient.svg";

const docs = [
  {
    label: "PolicyCenter Cloud",
    pagePath: "cloudProducts/cortina/policyCenterCloud",
  },
  {
    label: "ClaimCenter Cloud",
    pagePath: "cloudProducts/cortina/claimCenterCloud",
  },
  {
    label: "BillingCenter Cloud",
    pagePath: "cloudProducts/cortina/billingCenterCloud",
  },
  {
    label: "InsuranceNow",
    pagePath: "cloudProducts/cortina/insuranceNow/2021.1",
  },
  {
    label: "Guidewire Cloud Platform",
    pagePath: "cloudProducts/guidewireCloudPlatform",
  },
];

export default function Cortina() {
  return (
    <ProductFamilyLayout
      items={docs}
      backgroundProps={{
        ...baseBackgroundProps,
        backgroundImage: {
          sm: `url(${cortinaBackgroundImage})`,
          xs: `url(${gradientBackgroundImage})`,
        },
      }}
    />
  );
}
