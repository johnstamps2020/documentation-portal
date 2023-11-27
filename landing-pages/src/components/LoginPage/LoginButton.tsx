import Button from '@mui/material/Button';
import { useState } from 'react';
import { LoginButtonConfig } from './loginOptionConfigs';
import LoginInProgress from './LoginInProgress';
import { getRedirectToPath } from 'helpers/navigationHelpers';

export default function LoginButton({
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

  const computedHref = `${href}?redirectTo=${redirectTo}${
    region ? `&region=${region}` : ''
  }`;

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
