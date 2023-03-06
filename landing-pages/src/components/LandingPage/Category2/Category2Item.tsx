import { LandingPageItemData } from "../../../hooks/useLandingPageItems";
import LandingPageLink from "../LandingPageLink";

export default function Category2Item(landingPageItem: LandingPageItemData) {
  const sx = { color: "black", fontWeight: 600, padding: "4px 0px" };

  return <LandingPageLink landingPageItem={landingPageItem} sx={sx} />;
}
