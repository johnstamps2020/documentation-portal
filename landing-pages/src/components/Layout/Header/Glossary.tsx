import { MenuItem } from '@mui/material';
import React from 'react';
import iconGlossary from 'images/icon-glossary.svg';
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuLink,
} from 'components/Layout/StyledLayoutComponents';
import HeaderTooltip from './HeaderTooltip';

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
  const headerAndTooltipText = 'Guidewire glossary';

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
        <HeaderTooltip title={headerAndTooltipText}>
          <MenuItem>
            <HeaderMenuLink href="/glossary" disableReactRouter>
              {headerAndTooltipText}
            </HeaderMenuLink>
          </MenuItem>
        </HeaderTooltip>
      </HeaderMenu>
    </div>
  );
}
