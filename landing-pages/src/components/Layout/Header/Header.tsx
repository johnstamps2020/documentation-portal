import { StackProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import HeaderDesktop from './Desktop/HeaderDesktop';
import HeaderMobile from './Mobile/HeaderMobile';
import HeaderMenuItems from './HeaderMenuItems';
import SearchHeadWrapper from '../Search/SearchHeadWrapper';
import { HeaderContextProvider } from 'components/Layout/Header/HeaderContext';
import { useLocation } from 'react-router-dom';
import {
  SearchHeaderLayoutContextProvider,
  Filters,
} from '../Search/SearchDropdown/SearchHeaderLayoutContext';

export const headerHeight = '68px';

export const headerStyles: StackProps['sx'] = {
  position: 'relative', // for zIndex to work
  backgroundColor: 'hsl(216, 42%, 13%)',
  px: '16px',
};

export type HeaderOptions = {
  searchFilters?: Filters;
};

export default function Header() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const hideSearchBox = location.pathname === '/search-results';

  if (smallScreen) {
    return (
      <>
        <HeaderContextProvider>
          <SearchHeaderLayoutContextProvider>
            <HeaderMobile
              menuContents={
                <>
                  {!hideSearchBox && <SearchHeadWrapper />}
                  <HeaderMenuItems />
                </>
              }
            />
          </SearchHeaderLayoutContextProvider>
        </HeaderContextProvider>
      </>
    );
  }

  return (
    <>
      <HeaderContextProvider>
        <SearchHeaderLayoutContextProvider>
          <HeaderDesktop
            centerItems={
              !hideSearchBox && (
                <>
                  <SearchHeadWrapper />
                </>
              )
            }
            rightItems={<HeaderMenuItems />}
          />
        </SearchHeaderLayoutContextProvider>
      </HeaderContextProvider>
    </>
  );
}
