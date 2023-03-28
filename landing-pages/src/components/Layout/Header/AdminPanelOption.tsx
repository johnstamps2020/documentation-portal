import MenuItem from '@mui/material/MenuItem';
import { HeaderMenuLink } from 'components/Layout/StyledLayoutComponents';

export default function AdminPanelOption() {
  return (
    <MenuItem sx={{ width: 'fit-content' }}>
      <HeaderMenuLink href="/admin">Admin panel</HeaderMenuLink>
    </MenuItem>
  );
}
