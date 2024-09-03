import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import largeLogo from './img/gw-docs-logo-impact-color.svg';
import smallLogo from './img/logo-white.svg';
import { Link as RouterLink } from '@tanstack/react-router';

export default function Logo() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Link
      component={RouterLink}
      to="/"
      aria-label="Return to the home page"
      sx={{ display: 'contents' }}
    >
      {isLargeScreen ? (
        <img
          alt=""
          src={largeLogo}
          style={{ height: '32px', width: '292.67px' }}
        />
      ) : (
        <Stack direction="row" gap={2} alignItems="center">
          <img alt="" src={smallLogo} />
          <Typography
            sx={{ color: 'white', lineHeight: 1, fontWeight: 600 }}
            component="div"
          >
            Docs
          </Typography>
        </Stack>
      )}
    </Link>
  );
}
