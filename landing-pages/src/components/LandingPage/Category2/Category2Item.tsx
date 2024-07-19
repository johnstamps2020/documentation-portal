import LandingPageLink, {
  LandingPageLinkProps,
} from 'components/LandingPage/LandingPageLink';
import { LandingPageItemData } from 'helpers/landingPageHelpers';

export default function Category2Item(landingPageItem: LandingPageItemData) {
  const sx: LandingPageLinkProps['sx'] = {
    color: '#28333f',
    fontWeight: 600,
    lineHeight: '100%',
    fontSize: '14px',
    fontSmooth: 'subpixel-antialiased',
  };

  return <LandingPageLink landingPageItem={landingPageItem} sx={sx} />;
}
