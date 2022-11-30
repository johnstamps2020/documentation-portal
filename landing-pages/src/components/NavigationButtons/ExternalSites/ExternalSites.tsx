import { Avatar, Divider, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import iconExternalSites from "../../../images/icon-externalSites.svg";

export default function ExternalSites() {
    const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
        null
      );
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (event.currentTarget.id === "external-sites") {
          setAnchorElement(event.currentTarget);
        }
      };
      const handleClose = () => {
        setAnchorElement(null);
      };

  return (
    <div>
    <IconButton id="external-sites" onClick={handleClick}>
      <Avatar alt="External Sites" src={iconExternalSites} />
    </IconButton>
    <Menu
    anchorEl={anchorElement}
    id="external-sites-menu"
    open={Boolean(anchorElement)}
    onClose={handleClose}
    onClick={handleClose}
  >
    <Typography variant="body1">Guidewire sites</Typography>
    <Divider />
    <MenuItem>
      <Link href="https://community.guidewire.com/s/login">
        Customer Community
      </Link>
    </MenuItem>
    <MenuItem>
      <Link href="https://partner.guidewire.com/s/login">
        Partner Portal
      </Link>
    </MenuItem>
    <MenuItem>
      <Link href="https://developer.guidewire.com">Developer</Link>
    </MenuItem>
    <MenuItem>
      <Link href="https://education.guidewire.com/lmt/xlr8login.login?site=guidewire">
        Education
      </Link>
    </MenuItem>
    <MenuItem>
      <Link href="https://www.guidewire.com">Guidewire Website</Link>
    </MenuItem>
  </Menu>
  </div>
  );
}
