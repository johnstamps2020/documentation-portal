import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import LandingPageLink from '../LandingPageLink';

export default function SectionItem(item: LandingPageItemProps) {
  const sx = { color: "hsl(196, 100%, 31%)", fontSize: "16px" };

  return <LandingPageLink item={item} sx={sx} />;
}
