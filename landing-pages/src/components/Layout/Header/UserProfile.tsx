import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import LoginOptions from 'components/LoginPage/LoginOptions';
import { useUserInfo } from 'hooks/useApi';
import iconAvatar from 'images/icon-avatar.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import HeaderMenuDesktop from './Desktop/HeaderMenuDesktop';

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

  return (
    <>
      <Button onClick={toggleLoginDrawer(true)} variant="contained">
        Log in
      </Button>
      <Drawer
        anchor="right"
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
  const [loginDrawer, setLoginDrawer] = React.useState<boolean>(false);

  if (isError || isLoading || !userInfo) {
    return null;
  }

  if (!userInfo?.isLoggedIn) {
    return (
      <LoginButton drawerOpen={loginDrawer} setDrawerOpen={setLoginDrawer} />
    );
  }

  return (
    <HeaderMenuDesktop
      title={userInfo.name}
      subtitle={userInfo.preferred_username}
      iconSrc={iconAvatar}
      id="profile-menu"
      items={[
        {
          href: `/gw-logout?redirectTo=${window.location.href.replace(
            window.location.origin,
            ''
          )}`,
          children: 'Log out',
          disableReactRouter: true,
        },
        {
          href: '/admin-panel',
          children: 'Admin panel',
        },
      ]}
    />
  );
}
