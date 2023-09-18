import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as LogoLarge } from './img/gw-docs-logo-impact-color.svg';
import smallLogo from './img/logo-white.svg';

export default function Logo() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Link component={RouterLink} to="/" aria-label="Return to the home page">
      {isLargeScreen ? (
        <LogoLarge style={{ height: '32px', width: '292.67px' }} />
      ) : (
        <Stack direction="row" gap={2} alignItems="center">
          <img alt="" src={smallLogo} />
          <Typography
            sx={{ color: 'white', lineHeight: 1, fontWeight: 600 }}
            component="div"
          >
            Documentation
          </Typography>
        </Stack>
      )}
    </Link>
  );
}
