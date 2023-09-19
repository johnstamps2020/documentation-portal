import { StackProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBox from 'components/SearchBox/SearchBox';
import InternalBadge from '../../LandingPage/InternalBadge';
import HeaderDesktop from './Desktop/HeaderDesktop';
import ExternalSites from './ExternalSites';
import Glossary from './Glossary';
import HeaderMobile from './Mobile/HeaderMobile';
import TranslatedPages from './TranslatedPages';

export const headerHeight = '68px';

export const headerStyles: StackProps['sx'] = {
  position: 'relative', // for zIndex to work
  backgroundColor: 'hsl(216, 42%, 13%)',
  px: '16px',
};

export type HeaderOptions = {
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
};

function MenuItems() {
  return (
    <>
      <InternalBadge />
      <ExternalSites />
      <Glossary />
      <TranslatedPages />
    </>
  );
}

export default function Header(headerOptions: HeaderOptions) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (smallScreen) {
    return (
      <HeaderMobile
        menuContents={
          <>
            {!headerOptions?.hideSearchBox && <SearchBox big={false} />}
            <MenuItems />
          </>
        }
      />
    );
  }

  return (
    <HeaderDesktop
      centerItems={!headerOptions?.hideSearchBox && <SearchBox big={false} />}
      rightItems={<MenuItems />}
    />
  );
}
