import Stack from '@mui/material/Stack';
import { useState } from 'react';
import LoginButtonWithTooltip from './LoginButtonWithTooltip';
import GwEmployeeButton from './GwEmployeeButton';
import LoginInProgress from './LoginInProgress';
import Typography from '@mui/material/Typography';
import { ButtonProps } from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LoginButton from './LoginButton';

const loginButtons = [
  {
    label: 'Guidewire Cloud',
    href: '/authorization-code',
    tooltipText:
      'Use your Guidewire Cloud Platform account to access documentation',
  },
  {
    label: 'Customer Community',
    href: '/customers-login',
    tooltipText:
      'Use your community.guidewire.com account to access documentation',
  },
  {
    label: 'Partner Community',
    href: '/partners-login',
    tooltipText:
      'Use your partner.guidewire.com account to access documentation',
  },
];

type LoginOptionsProps = {
  inDrawer?: boolean;
};

export default function LoginOptions({ inDrawer = false }: LoginOptionsProps) {
  const [loginInProgress, setLoginInProgress] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const isLoginPage = window.location.pathname.endsWith('/gw-login');
  const redirectTo =
    query.get('redirectTo') ||
    (isLoginPage && '/') ||
    window.location.href.replace(window.location.origin, '');

  const cardButtonStyle: ButtonProps['sx'] = {
    fontSize: '1.3rem',
    fontWeight: 600,
    textTransform: 'none',
  };

  if (inDrawer) {
    return (
      <Stack spacing={2}>
        <LoginInProgress loginIsInProgress={loginInProgress} />
        {loginButtons.map((loginButtonProps) => (
          <LoginButtonWithTooltip
            loginButtonProps={loginButtonProps}
            placement="left"
            key={loginButtonProps.label}
            redirectTo={redirectTo}
            onClick={() => setLoginInProgress(true)}
          />
        ))}
        <GwEmployeeButton
          buttonStyle={{ fontWeight: 600, border: 1 }}
          redirectTo={redirectTo}
          onClick={() => setLoginInProgress(true)}
        />
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <LoginInProgress loginIsInProgress={loginInProgress} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { md: 'repeat(3, 1fr)', sm: '1fr' },
          gap: 1,
          px: 2,
        }}
      >
        {loginButtons.map((loginButtonProps) => (
          <Paper
            key={loginButtonProps.label}
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              padding: '2rem 1rem',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography
              component="h2"
              sx={{ fontSize: '1.125rem', fontWeight: 600 }}
            >
              {loginButtonProps.label}
            </Typography>
            <Typography>{loginButtonProps.tooltipText}</Typography>
            <LoginButton
              loginButtonProps={{
                href: loginButtonProps.href,
                label: 'Continue',
              }}
              key={loginButtonProps.label}
              redirectTo={redirectTo}
              onClick={() => setLoginInProgress(true)}
            />
          </Paper>
        ))}
      </Box>
      <Box>
        <GwEmployeeButton
          label="Click here to log in as an employee"
          buttonStyle={{
            ...cardButtonStyle,
            fontSize: '1rem',
            border: 1,
          }}
          redirectTo={redirectTo}
          onClick={() => setLoginInProgress(true)}
        />
      </Box>
    </Stack>
  );
}
