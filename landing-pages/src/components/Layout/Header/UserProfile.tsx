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
import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

function LoginButton() {
  return (
    <Button variant="contained" to="/gw-login" component={Link}>
      Log in
    </Button>
  );
}

export default function UserProfile() {
  const { userInfo } = useUser();
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

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
        <MenuItem>
          <HeaderMenuLink href="/gw-logout">Log out</HeaderMenuLink>
        </MenuItem>
      </HeaderMenu>
    </div>
  );
}
