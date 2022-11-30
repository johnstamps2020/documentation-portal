import {
  Avatar,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
import iconAvatar from "../../../images/icon-avatar.svg";

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
      <IconButton id="profile" onClick={handleClick}>
        <Avatar alt="User Avatar" src={iconAvatar} />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        id="profile-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <Typography variant="body1">Name Surname</Typography>
        <Typography variant="h5">e-mail address</Typography>
        <Divider />
        <MenuItem>
          <Link href="" style={{ color: "black" }}>
            Log out
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
