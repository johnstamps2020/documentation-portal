import Button, { ButtonProps } from '@mui/material/Button';

type GwEmployeeButtonProps = {
  label?: string;
  redirectTo: string;
  buttonStyle?: ButtonProps['sx'];
  onClick?: () => void;
};

export default function GwEmployeeButton({
  label = 'Guidewire employee',
  buttonStyle,
  redirectTo,
  onClick,
}: GwEmployeeButtonProps) {
  return (
    <Button
      variant="outlined"
      color="primary"
      href={`/authorization-code?redirectTo=${redirectTo}`}
      sx={buttonStyle}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
