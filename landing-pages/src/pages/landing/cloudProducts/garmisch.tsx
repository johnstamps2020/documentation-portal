import { baseBackgroundProps, LandingPageProps } from "..";
import CategoryLayout2 from "../../../components/LandingPage/Category/CategoryLayout2";
import gradientBackgroundImage from "../../../images/background-gradient.svg";
import garmischBackgroundImage from "./background-garmisch.png";

export default function Garmisch({ pageData }: LandingPageProps) {
  const backgroundImage = {
    xs: `url(${gradientBackgroundImage})`,
    sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${garmischBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
  };

  return (
    <CategoryLayout2
      pageData={pageData}
      backgroundProps={{ ...baseBackgroundProps, backgroundImage }}
    />
  );
}
