import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { getRedirectToPath } from '../../lib';
import { useAvatar } from './AvatarContext';

export function AvatarButtonWithMenu() {
  const { userInfo, additionalLinks } = useAvatar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { name, preferred_username } = userInfo;

  return (
    <>
      <IconButton
        id="avatar-button"
        aria-controls={open ? 'avatar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          color: 'white',
          padding: 0,
        }}
        onClick={handleClick}
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        open={open}
        id="avatar-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'avatar-button',
        }}
      >
        <ListItem>
          <Box>
            <Typography>{name}</Typography>
            <Typography
              sx={{
                fontSize: '80%',
              }}
            >
              {preferred_username}
            </Typography>
          </Box>
        </ListItem>
        <Divider />
        {additionalLinks.map(({ href, label }, idx) => (
          <MenuItem href={href} component="a">
            {label}
          </MenuItem>
        ))}
        <MenuItem
          href={`/gw-logout?redirectTo=${getRedirectToPath()}`}
          component={'a'}
        >
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
