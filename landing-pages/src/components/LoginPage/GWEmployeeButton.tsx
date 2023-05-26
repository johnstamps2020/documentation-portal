import Button from '@mui/material/Button';

type GwEmployeeButtonProps = {
  redirectTo: string;
  buttonStyle?: {};
};

export default function GwEmployeeButton({
  buttonStyle,
  redirectTo,
}: GwEmployeeButtonProps) {
  const buttonText = 'Guidewire Employee';
  return (
    <Button
      variant="outlined"
      color="primary"
      href={`/authorization-code?idp=okta&redirectTo=${redirectTo}`}
      sx={buttonStyle}
    >
      {buttonText}
    </Button>
  );
}
