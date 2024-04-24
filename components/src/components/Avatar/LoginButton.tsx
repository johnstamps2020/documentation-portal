import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import React from 'react';
import { LoginButtonsInDrawer } from './LoginButtonsInDrawer';
import { useAvatar } from './AvatarContext';
import { getRedirectToPath } from '../../lib';

type LoginButtonProps = {};

export function LoginButton() {
  const { setDrawerOpen, drawerOpen, LinkComponent } = useAvatar();
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
          <Link
            component={LinkComponent || 'a'}
            to={`/gw-login?redirectTo-${getRedirectToPath()}`}
          >
            Go to the login page
          </Link>
        </Stack>
      </Drawer>
    </>
  );
}
