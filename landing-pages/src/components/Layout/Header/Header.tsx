import Logo from './Logo/Logo';
import SearchBox from 'components/SearchBox/SearchBox';
import ExternalSites from './ExternalSites';
import Glossary from './Glossary';
import TranslatedPages from './TranslatedPages';
import UserProfile from './UserProfile';
import { HeaderOptions } from 'components/Layout/Layout';
import Stack from '@mui/material/Stack';
import InternalBadge from '../../LandingPage/InternalBadge';
import { useTheme } from '@mui/material/styles';

export const headerHeight = '80px';
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
        padding: '6px 20px 6px 6px',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Logo />
      {!headerOptions?.hideSearchBox && <SearchBox showBigSize={false} />}
      <Stack
        direction="row"
        justifyContent={{ xs: 'center', sm: 'right' }}
        width={{ sm: '100%', md: '400px' }}
        spacing={2}
        alignItems="center"
      >
        <InternalBadge />
        <ExternalSites />
        <Glossary />
        <TranslatedPages />
        {!headerOptions.hideUserProfile && <UserProfile />}
      </Stack>
    </Stack>
  );
}
