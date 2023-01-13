import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import React from "react";
import iconAvatar from "../../../images/icon-avatar.svg";
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuDivider,
  HeaderMenuLink,
  HeaderMenuSubtitle,
  HeaderMenuTitle
} from "../StyledLayoutComponents";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import Drawer from "@mui/material/Drawer";
import LoginOptions from "../../LoginPage/LoginOptions";
import Stack from "@mui/material/Stack";

export default function UserProfile() {
  const { userInfo } = useUser();
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );
  const [loginDrawer, setLoginDrawer] = React.useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  function toggleLoginDrawer(open: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setLoginDrawer(open);
    };
  }

  function LoginButton() {
    const anchor = "right";
    return (
      <>
        <Button onClick={toggleLoginDrawer(true)} variant="contained">
          Log in
        </Button>
        <Drawer
          anchor={anchor}
          open={loginDrawer}
          onClose={toggleLoginDrawer(false)}
          PaperProps={{ sx: { justifyContent: "center" } }}
        >
          <Stack alignItems="center" spacing={4} margin="16px">
            <LoginOptions />
            <Link component={RouterLink} to="/gw-login">
              Go to the login page
            </Link>
          </Stack>
        </Drawer>
      </>
    );
  }

  if (!userInfo?.isLoggedIn) {
    return <LoginButton />;
  }

  return (
    <div>
      <HeaderIconButton id="profile" onClick={handleClick}>
        <HeaderAvatar alt="User Avatar" src={iconAvatar} />
      </HeaderIconButton>
      <HeaderMenu
        anchorEl={anchorElement}
        id="profile-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <HeaderMenuTitle>{userInfo.name}</HeaderMenuTitle>
        <HeaderMenuSubtitle>{userInfo.preferred_username}</HeaderMenuSubtitle>
        <HeaderMenuDivider />
        <MenuItem sx={{ width: "fit-content" }}>
          <HeaderMenuLink href="/gw-logout">Log out</HeaderMenuLink>
        </MenuItem>
      </HeaderMenu>
    </div>
  );
}
