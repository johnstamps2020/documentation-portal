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
import iconTranslatedDocs from "../../../images/icon-translatedDocs.svg";

export default function TranslatedPages() {
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
      <IconButton id="translated-documents" onClick={handleClick}>
        <Avatar alt="Translated Documents" src={iconTranslatedDocs} />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        id="translated-docs-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <Typography variant="body1">Translated documentation</Typography>
        <Divider />
        <MenuItem>
          <Link href="">Deutch</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">Español (España)</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">Español</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">Français</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">Italiano</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">日本語</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">Nederlands</Link>
        </MenuItem>
        <MenuItem>
          <Link href="">Português</Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
