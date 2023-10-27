import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import LoginOptions from 'components/LoginPage/LoginOptions';
import { useLayoutContext } from 'LayoutContext';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginPage() {
  const { setTitle, setHeaderOptions, setBackgroundColor } = useLayoutContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.fonts.load('12px Source Sans Pro').then(() => setMounted(true));
  }, []);

  useEffect(() => {
    setTitle('Guidewire Documentation | Log in');
    setBackgroundColor('hsl(0, 0%, 98%)');
  }, [setBackgroundColor, setHeaderOptions, setTitle]);

  if (mounted === false) {
    return (
      <Box
        justifyContent="center"
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack alignItems="center" justifyContent="center" gap={1}>
      <Box
        sx={{
          background: 'linear-gradient(to right, #324c76, #719fe8)',
          width: '100%',
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          justifyContent: 'space-evenly',
          gap: 2,
          py: { xs: 3, sm: 1 },
          px: { xs: 3, sm: 2 },
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            margin: 0,
            display: 'block',
            fontSize: { xs: 30, sm: 40 },
            textAlign: { xs: 'center', sm: 'right' },
            color: 'white',
            fontWeight: 600,
          }}
        >
          Welcome to Guidewire documentation
        </Typography>
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            height: '373px',
            width: '555px',
          }}
        >
          <img
            src="/images/login-hero.svg"
            alt=""
            style={{
              height: '100%',
              maxWidth: '100%',
              padding: '0 2rem',
            }}
          />
        </Box>
      </Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={1}
        sx={{ py: '1rem', width: '100%', textAlign: 'center' }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '1.3rem',
            color: 'hsl(216, 42%, 13%)',
            width: '100%',
          }}
        >
          Browse through the{' '}
          <Link component={RouterLink} to="/apiReferences">
            latest API References
          </Link>
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '1.3rem',
            color: 'hsl(216, 42%, 13%)',
          }}
        >
          To view complete documentation, log in to your account
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            gap: '8px',
            padding: { xs: 0, sm: 4 },
            maxWidth: '1062px',
          }}
        >
          <LoginOptions />
        </Box>
      </Stack>
    </Stack>
  );
}
