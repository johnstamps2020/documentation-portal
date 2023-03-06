import { LandingPageItemData } from '../../../hooks/useLandingPageItems';
import LandingPageLink from '../LandingPageLink';

export default function SectionItem(landingPageItem: LandingPageItemData) {
  const sx = { color: 'hsl(196, 100%, 31%)', fontSize: '16px' };

  return <LandingPageLink landingPageItem={landingPageItem} sx={sx} />;
}
