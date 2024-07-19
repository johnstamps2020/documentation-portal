import LandingPageLink from 'components/LandingPage/LandingPageLink';
import { LandingPageItemData } from 'helpers/landingPageHelpers';

export default function CategoryItem(landingPageItem: LandingPageItemData) {
  const sx = {
    color: 'hsl(196, 100%, 31%)',
    padding: '4px 0px',
    fontSize: '16px',
  };

  return <LandingPageLink landingPageItem={landingPageItem} sx={sx} />;
}
