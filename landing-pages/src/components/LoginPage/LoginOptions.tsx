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
  const buttonStyle = {
    width: '250px',
    height: '80px',
    fontSize: '18px',
    fontWeight: 600,
    margin: '15px',
  };
  return (
    <Stack
      direction="row"
      marginBottom="70px"
      flexWrap="wrap"
      sx={{ justifyContent: 'space-evenly', alignItems: 'center' }}
    >
      {loginButtons.map((loginButton) => (
        <Tooltip
          key={loginButton.label}
          title={<Typography>{loginButton.tooltipText}</Typography>}
          placement="bottom"
          arrow
          sx={{ fontSize: '16px' }}
        >
          <Button
            href={`${loginButton.href}?redirectTo=${redirectTo}`}
            variant="contained"
            color="primary"
            sx={buttonStyle}
          >
            {loginButton.label}
          </Button>
        </Tooltip>
      ))}
      <Button
        variant="outlined"
        color="primary"
        href={`/authorization-code?idp=okta&redirectTo=${redirectTo}`}
        sx={{ ...buttonStyle, border: 1 }}
      >
        Guidewire Employee
      </Button>
    </Stack>
  );
}
