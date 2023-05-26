import Button from '@mui/material/Button';

type GWEmployeeButtonProps = {
  redirectTo: string;
  buttonStyle?: {};
};

export default function GWEmployeeButton({
  buttonStyle,
  redirectTo,
}: GWEmployeeButtonProps) {
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
