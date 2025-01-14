import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExternalSitesDesktop from './Desktop/ExternalSitesDesktop';
import ExternalSitesMobile from './Mobile/ExternalSitesMobile';
import { HeaderMenuLinkProps } from '../StyledLayoutComponents';

export const externalSites: HeaderMenuLinkProps[] = [
  {
    children: 'Customer Community',
    href: 'https://community.guidewire.com/s/login',
  },
  {
    children: 'Partner Portal',
    href: 'https://partner.guidewire.com/s/login',
  },
  {
    children: 'Developer',
    href: 'https://developer.guidewire.com',
  },
  {
    children: 'Education',
    href: 'https://education.guidewire.com/lmt/xlr8login.login?site=guidewire',
  },
  {
    children: 'Guidewire Website',
    href: 'https://www.guidewire.com',
  },
].map((link) => ({
  ...link,
  disableReactRouter: true,
  target: '_blank',
  rel: 'noopener noreferrer',
}));

export default function ExternalSites() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (smallScreen) {
    return <ExternalSitesMobile />;
  }

  return <ExternalSitesDesktop />;
}
