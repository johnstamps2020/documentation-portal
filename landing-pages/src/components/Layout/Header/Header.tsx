import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import SearchBox from 'components/SearchBox/SearchBox';
import InternalBadge from '../../LandingPage/InternalBadge';
import ExternalSites from './ExternalSites';
import Glossary from './Glossary';
import Logo from './Logo/Logo';
import TranslatedPages from './TranslatedPages';
import UserProfile from './UserProfile';

export const headerHeight = '64px';

export type HeaderOptions = {
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
};

export default function Header(headerOptions: HeaderOptions) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      height={{ xs: 'auto', sm: headerHeight }}
      alignItems="center"
      justifyContent={{ xs: 'center', sm: 'space-between' }}
      spacing={{ xs: 1, sm: 2 }}
      sx={{
        position: 'relative', // for zIndex to work
        width: '100%',
        backgroundColor: 'hsl(216, 42%, 13%)',
        padding: '16px',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Logo />
      {!headerOptions?.hideSearchBox && <SearchBox big={false} />}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        width={{ sm: '100%', md: '400px' }}
        gap="24px"
      >
        <InternalBadge />
        <ExternalSites />
        <Glossary />
        <TranslatedPages />
        <UserProfile />
      </Stack>
    </Stack>
  );
}
