import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function LoginOptions() {
  const query = new URLSearchParams(window.location.search);
  const isLoginPage = window.location.pathname.endsWith('/gw-login');
  const redirectTo =
    query.get('redirectTo') ||
    (isLoginPage && '/') ||
    window.location.href.replace(window.location.origin, '');
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
  return (
    <Stack spacing={2}>
      {loginButtons.map((loginButton) => (
        <Tooltip
          key={loginButton.label}
          title={<Typography>{loginButton.tooltipText}</Typography>}
          placement="left"
          arrow
        >
          <Button
            href={`${loginButton.href}?redirectTo=${redirectTo}`}
            variant="contained"
            color="primary"
          >
            {loginButton.label}
          </Button>
        </Tooltip>
      ))}
      <Button
        variant="outlined"
        color="primary"
        href={`/authorization-code?idp=okta&redirectTo=${redirectTo}`}
        sx={{ fontWeight: 600, border: 1 }}
      >
        Guidewire Employee
      </Button>
    </Stack>
  );
}
