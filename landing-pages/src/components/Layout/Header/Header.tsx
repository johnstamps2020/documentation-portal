import { StackProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import HeaderDesktop from './Desktop/HeaderDesktop';
import HeaderMobile from './Mobile/HeaderMobile';
import HeaderMenuItems from './HeaderMenuItems';
import SearchHeadWrapper from '../Search/SearchHeadWrapper';

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

export default function Header(headerOptions: HeaderOptions) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (smallScreen) {
    return (
      <HeaderMobile
        menuContents={
          <>
            {!headerOptions?.hideSearchBox && <SearchHeadWrapper />}
            <HeaderMenuItems />
          </>
        }
      />
    );
  }

  return (
    <HeaderDesktop
      centerItems={
        !headerOptions?.hideSearchBox && (
          <>
            <SearchHeadWrapper />
          </>
        )
      }
      rightItems={<HeaderMenuItems />}
    />
  );
}
