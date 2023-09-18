import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import GlossaryDesktop from './Desktop/GlossaryDesktop';
import GlossaryMobile from './Mobile/GlossaryMobile';
import { HeaderMenuLinkProps } from '../StyledLayoutComponents';

export const glossaryLink: HeaderMenuLinkProps = {
  children: 'Glossary',
  href: '/glossary',
  disableReactRouter: true,
};

export default function Glossary() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (smallScreen) {
    return <GlossaryMobile />;
  }

  return <GlossaryDesktop />;
}
