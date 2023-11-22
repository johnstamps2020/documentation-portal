import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useUserInfo } from 'hooks/useApi';
import iconAvatar from 'images/icon-avatar.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import HeaderMenuDesktop from './Desktop/HeaderMenuDesktop';
import { useAdminLinks } from 'hooks/useAdminLinks';
import LoginButtonsInDrawer from '../../LoginPage/LoginButtonsInDrawer';

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
        PaperProps={{
          sx: {
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '300px',
          },
        }}
      >
        <Stack alignItems="center" spacing={4} margin="16px">
          <LoginButtonsInDrawer />
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
  const { adminLinks } = useAdminLinks();
  const [loginDrawer, setLoginDrawer] = React.useState<boolean>(false);

  if (
    isError ||
    isLoading ||
    !userInfo ||
    window.location.pathname.startsWith('/gw-login')
  ) {
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
      iconSize={32}
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
        ...adminLinks,
      ]}
    />
  );
}
