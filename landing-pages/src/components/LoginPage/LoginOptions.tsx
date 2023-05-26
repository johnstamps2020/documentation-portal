import Stack from '@mui/material/Stack';
import ButtonWithTooltip from './ButtonWithTooltip';
import GwEmployeeButton from './GwEmployeeButton'

type LoginOptionsProps = {
  inDrawer?: boolean;
};
export default function LoginOptions({ inDrawer = false }: LoginOptionsProps) {
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

  if (inDrawer) {
    return (
      <Stack spacing={2}>
        {loginButtons.map((loginButtonProps) => (
          <ButtonWithTooltip
            loginButtonProps={loginButtonProps}
            placement="left"
            key={loginButtonProps.label}
            redirectTo={redirectTo}
          />
        ))}
        <GwEmployeeButton
          buttonStyle={{ fontWeight: 600, border: 1 }}
          redirectTo={redirectTo}
        />
      </Stack>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        marginBottom="50px"
        flexWrap="wrap"
        sx={{ justifyContent: 'space-around', alignItems: 'center' }}
      >
        {loginButtons.map((loginButtonProps) => (
          <ButtonWithTooltip
            loginButtonProps={loginButtonProps}
            placement="bottom"
            key={loginButtonProps.label}
            redirectTo={redirectTo}
            tooltipStyle={{ fontSize: '16px' }}
            buttonStyle={buttonStyle}
          />
        ))}
      </Stack>
      <GwEmployeeButton
        buttonStyle={{
          ...buttonStyle,
          border: 1,
          height: '65px',
          width: '230px',
        }}
        redirectTo={redirectTo}
      />
    </>
  );
}
