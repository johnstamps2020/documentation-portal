import MenuItem from '@mui/material/MenuItem';
import { HeaderMenuLink } from 'components/Layout/StyledLayoutComponents';

export default function LogoutMenuItem() {
  const redirectTo = `/gw-logout?redirectTo=${window.location.href.replace(
    window.location.origin,
    ''
  )}`;
  return (
    <MenuItem sx={{ width: 'fit-content' }}>
      <HeaderMenuLink href={redirectTo} disableReactRouter>
        Log out
      </HeaderMenuLink>
    </MenuItem>
  );
}
