import MenuItem from "@mui/material/MenuItem";
import { useLocation } from "react-router-dom";
import { HeaderMenuLink } from "../StyledLayoutComponents";

export default function LogoutOption() {
  const location = useLocation();
  const redirectTo = `/gw-logout?redirectTo=/landing${location.pathname}`;
  return (
    <MenuItem sx={{ width: "fit-content" }}>
      <HeaderMenuLink href={redirectTo}>Log out</HeaderMenuLink>
    </MenuItem>
  );
}
