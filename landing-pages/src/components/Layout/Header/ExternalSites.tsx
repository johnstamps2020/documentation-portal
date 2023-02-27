import { MenuItem } from '@mui/material';
import React from 'react';
import iconExternalSites from '../../../images/icon-externalSites.svg';
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuDivider,
  HeaderMenuLink,
  HeaderMenuTitle,
} from '../StyledLayoutComponents';

export default function ExternalSites() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );

  const sites = [
    {
      label: 'Customer Community',
      url: 'https://community.guidewire.com/s/login',
    },
    {
      label: 'Partner Portal',
      url: 'https://partner.guidewire.com/s/login',
    },
    {
      label: 'Developer',
      url: 'https://developer.guidewire.com',
    },
    {
      label: 'Education',
      url: 'https://education.guidewire.com/lmt/xlr8login.login?site=guidewire',
    },
    {
      label: 'Guidewire Website',
      url: 'https://www.guidewire.com',
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === 'external-sites') {
      setAnchorElement(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <div>
      <HeaderIconButton id="external-sites" onClick={handleClick}>
        <HeaderAvatar alt="External Sites" src={iconExternalSites} />
      </HeaderIconButton>
      <HeaderMenu
        anchorEl={anchorElement}
        id="external-sites-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <HeaderMenuTitle>Guidewire sites</HeaderMenuTitle>
        <HeaderMenuDivider />
        {sites.map((s) => (
          <MenuItem key={s.label}>
            <HeaderMenuLink href={s.url}>{s.label}</HeaderMenuLink>
          </MenuItem>
        ))}
      </HeaderMenu>
    </div>
  );
}
