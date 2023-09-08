import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import LoginOptions from 'components/LoginPage/LoginOptions';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function LoginPage() {
  const { setTitle, setHeaderOptions, setBackgroundColor } = useLayoutContext();
  useEffect(() => {
    setTitle('Guidewire Documentation | Log in');
    setBackgroundColor('hsl(0, 0%, 98%)');
  }, [setBackgroundColor, setHeaderOptions, setTitle]);

  return (
    <Stack alignItems="center" justifyContent="center">
      <Box
        sx={{
          background: 'linear-gradient(to right, #324c76, #719fe8)',
          width: '100%',
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          py: '1rem',
          justifyContent: 'space-evenly',
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
        <img
          src="/images/login-hero.svg"
          alt=""
          style={{
            width: '350px',
            height: '350px',
            maxWidth: '100%',
            padding: '0 2rem',
          }}
        />
      </Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={4}
        sx={{ py: '2rem', width: '100%', textAlign: 'center' }}
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
