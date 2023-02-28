import { LandingPageItemProps } from "../../../pages/LandingPage/LandingPage";
import LandingPageLink from "../LandingPageLink";

export default function Category2Item(item: LandingPageItemProps) {
  const sx = { color: "black", fontWeight: 600, padding: "4px 0px" };

  return <LandingPageLink item={item} sx={sx} />;
}
