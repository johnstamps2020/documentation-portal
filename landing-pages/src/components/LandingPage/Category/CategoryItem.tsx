import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import LandingPageLink from '../LandingPageLink';

export default function CategoryItem(item: LandingPageItemProps) {
  const sx = { color: "hsl(196, 100%, 31%)", padding: "4px 0px", fontSize: "16px" };

  return <LandingPageLink item={item} sx={sx} />;
}
