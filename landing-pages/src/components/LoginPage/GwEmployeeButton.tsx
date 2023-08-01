import Button from '@mui/material/Button';

type GwEmployeeButtonProps = {
  redirectTo: string;
  buttonStyle?: {};
  onClick?: () => void;
};

export default function GwEmployeeButton({
  buttonStyle,
  redirectTo,
  onClick,
}: GwEmployeeButtonProps) {
  const buttonText = 'Guidewire Employee';
  return (
    <Button
      variant="outlined"
      color="primary"
      href={`/authorization-code?idp=okta&redirectTo=${redirectTo}`}
      sx={buttonStyle}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}
