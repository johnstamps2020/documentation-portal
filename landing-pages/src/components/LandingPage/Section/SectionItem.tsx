import LandingPageLink from 'components/LandingPage/LandingPageLink';
import { LandingPageItemData } from 'hooks/hookTypes';

export default function SectionItem(landingPageItem: LandingPageItemData) {
  const sx = { color: 'hsl(196, 100%, 31%)', fontSize: '16px' };

  return <LandingPageLink landingPageItem={landingPageItem} sx={sx} />;
}
