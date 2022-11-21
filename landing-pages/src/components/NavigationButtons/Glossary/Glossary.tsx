import { Avatar, IconButton, Link, Menu, MenuItem } from "@mui/material";
import React from "react";
import iconGlossary from "../../../images/icon-glossary.svg";

export default function Glossary() {
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
      <IconButton id="glossary" onClick={handleClick}>
        <Avatar alt="Glossary" src={iconGlossary} />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        id="glossary-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem>
          <Link href="https://docs.int.ccs.guidewire.net/glossary">
            Guidewire Glossary
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
