import Button from '@mui/material/Button';
import { getRedirectToPath } from '../../lib/navigationHelpers';
import React, { useState } from 'react';
import { LoginInProgress } from './LoginInProgress';
import { LoginButtonConfig } from './loginOptionConfigs';

export function LoginButtonForDrawer({
  href,
  label,
  region,
  sx,
  variant,
  color,
}: LoginButtonConfig) {
  const [loginInProgress, setLoginInProgress] = useState(false);

  const query = new URLSearchParams(window.location.search);
  const isLoginPage = window.location.pathname.endsWith('/gw-login');
  const redirectTo =
    query.get('redirectTo') || (isLoginPage && '/') || getRedirectToPath();

  function handleClick() {
    setLoginInProgress(true);
  }

  const computedHref = `${href}?${
    region ? `region=${region}&` : ''
  }redirectTo=${redirectTo}`;

  return (
    <>
      <LoginInProgress loginIsInProgress={loginInProgress} />
      <Button
        href={computedHref}
        variant={variant || 'contained'}
        color={color || 'primary'}
        sx={sx}
        onClick={handleClick}
      >
        {label || 'Continue'}
      </Button>
    </>
  );
}
