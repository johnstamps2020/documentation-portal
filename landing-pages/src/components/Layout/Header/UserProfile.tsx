import { Menu, MenuItem } from "@mui/material";
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

export default function UserProfile() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

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
        <HeaderMenuTitle>Alfred Lord Tennyson</HeaderMenuTitle>
        <HeaderMenuSubtitle>atennyson@guidewire.com</HeaderMenuSubtitle>
        <HeaderMenuDivider />
        <MenuItem>
          <HeaderMenuLink href="/gw-logout">Log out</HeaderMenuLink>
        </MenuItem>
      </HeaderMenu>
    </div>
  );
}
