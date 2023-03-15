import { MenuItem } from '@mui/material';
import React from 'react';
import iconGlossary from 'images/icon-glossary.svg';
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuLink,
} from 'components/Layout/StyledLayoutComponents';

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
      <HeaderIconButton id="glossary" onClick={handleClick}>
        <HeaderAvatar alt="Glossary" src={iconGlossary} />
      </HeaderIconButton>
      <HeaderMenu
        anchorEl={anchorElement}
        id="glossary-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem>
          <HeaderMenuLink href="/glossary" disableReactRouter>
            Guidewire Glossary
          </HeaderMenuLink>
        </MenuItem>
      </HeaderMenu>
    </div>
  );
}
