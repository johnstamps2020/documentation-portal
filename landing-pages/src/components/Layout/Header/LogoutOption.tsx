import MenuItem from "@mui/material/MenuItem";
import { HeaderMenuLink } from "../StyledLayoutComponents";

export default function LogoutOption() {
  const redirectTo = `/gw-logout?redirectTo=${window.location.href.replace(
    window.location.origin,
    ""
  )}`;
  return (
    <MenuItem sx={{ width: "fit-content" }}>
      <HeaderMenuLink href={redirectTo}>Log out</HeaderMenuLink>
    </MenuItem>
  );
}
