import { Button, Tooltip, Typography } from '@mui/material';

type LoginButtonWithTooltipProps = {
  loginButtonProps: {
    label: string;
    href: string;
    tooltipText: string;
  };
  placement: 'left' | 'bottom';
  redirectTo: string;
  tooltipStyle?: {};
  buttonStyle?: {};
  onClick?: () => void;
};

export default function LoginButtonWithTooltip({
  loginButtonProps,
  placement,
  redirectTo,
  tooltipStyle,
  buttonStyle,
  onClick,
}: LoginButtonWithTooltipProps) {
  return (
    <Tooltip
      key={loginButtonProps.label}
      title={<Typography>{loginButtonProps.tooltipText}</Typography>}
      placement={placement}
      arrow
      sx={tooltipStyle}
    >
      <Button
        href={`${loginButtonProps.href}?redirectTo=${redirectTo}`}
        variant="contained"
        color="primary"
        sx={buttonStyle}
        onClick={onClick}
      >
        {loginButtonProps.label}
      </Button>
    </Tooltip>
  );
}
