import { Button } from '@mui/material';

type LoginButtonProps = {
  loginButtonProps: {
    label: string;
    href: string;
  };
  redirectTo: string;
  buttonStyle?: {};
  onClick?: () => void;
};

export default function LoginButton({
  loginButtonProps,
  redirectTo,
  buttonStyle,
  onClick,
}: LoginButtonProps) {
  return (
    <Button
      href={`${loginButtonProps.href}?redirectTo=${redirectTo}`}
      variant="contained"
      color="primary"
      sx={buttonStyle}
      onClick={onClick}
    >
      {loginButtonProps.label}
    </Button>
  );
}
