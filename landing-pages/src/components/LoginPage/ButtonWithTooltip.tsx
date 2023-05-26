import { Tooltip, Typography, Button } from '@mui/material';

type ButtonWithTooltipProps = {
  loginButtonProps: {
    label: string;
    href: string;
    tooltipText: string;
  };
  placement: 'left' | 'bottom';
  redirectTo: string;
  tooltipStyle?: {};
  buttonStyle?: {};
};

export default function ButtonWithTooltip({
  loginButtonProps,
  placement,
  redirectTo,
  tooltipStyle,
  buttonStyle,
}: ButtonWithTooltipProps) {
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
      >
        {loginButtonProps.label}
      </Button>
    </Tooltip>
  );
}
