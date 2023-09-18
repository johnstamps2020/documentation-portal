import Button from '@mui/material/Button';
import React from 'react';
import iconAvatar from 'images/icon-avatar.svg';
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuDivider,
  HeaderMenuSubtitle,
  HeaderMenuTitle,
} from 'components/Layout/StyledLayoutComponents';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useUserInfo } from 'hooks/useApi';
import Drawer from '@mui/material/Drawer';
import LoginOptions from 'components/LoginPage/LoginOptions';
import Stack from '@mui/material/Stack';
import LogoutMenuItem from './LogoutMenuItem';
import AdminPanelMenuItem from './AdminPanelMenuItem';
import HeaderTooltip from './HeaderTooltip';

type LoginButtonProps = {
  drawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
};

function LoginButton({ drawerOpen, setDrawerOpen }: LoginButtonProps) {
  function toggleLoginDrawer(open: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };
  }

  const anchor = 'right';
  return (
    <>
      <Button onClick={toggleLoginDrawer(true)} variant="contained">
        Log in
      </Button>
      <Drawer
        anchor={anchor}
        open={drawerOpen}
        onClose={toggleLoginDrawer(false)}
        PaperProps={{ sx: { justifyContent: 'center' } }}
      >
        <Stack alignItems="center" spacing={4} margin="16px">
          <LoginOptions inDrawer={true} />
          <Link component={RouterLink} to="/gw-login">
            Go to the login page
          </Link>
        </Stack>
      </Drawer>
    </>
  );
}

export default function UserProfile() {
  const { userInfo, isError, isLoading } = useUserInfo();

  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );
  const [loginDrawer, setLoginDrawer] = React.useState<boolean>(false);

  if (isError || isLoading || !userInfo) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  if (!userInfo?.isLoggedIn) {
    return (
      <LoginButton drawerOpen={loginDrawer} setDrawerOpen={setLoginDrawer} />
    );
  }

  const tooltipText = 'User information';
  const tooltipItems = [
    <HeaderMenuTitle>{userInfo.name}</HeaderMenuTitle>,
    <HeaderMenuSubtitle>{userInfo.preferred_username}</HeaderMenuSubtitle>,
    <HeaderMenuDivider />,
    <div>
      <LogoutMenuItem />
    </div>,
    <div>
      <AdminPanelMenuItem />
    </div>,
  ];

  return (
    <div>
      <HeaderIconButton id="profile" onClick={handleClick}>
        <HeaderAvatar
          alt="User Avatar"
          src={iconAvatar}
          sx={{ width: '31px', height: '32px' }}
        />
      </HeaderIconButton>
      <HeaderMenu
        anchorEl={anchorElement}
        id="profile-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        {tooltipItems.map((item, index) => (
          <HeaderTooltip key={index} title={tooltipText}>
            {item}
          </HeaderTooltip>
        ))}
      </HeaderMenu>
    </div>
  );
}
