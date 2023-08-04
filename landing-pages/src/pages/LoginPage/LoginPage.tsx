import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoginOptions from 'components/LoginPage/LoginOptions';
import { Paper } from '@mui/material';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const { setTitle, setHeaderOptions, setBackgroundColor } = useLayoutContext();
  useEffect(() => {
    setTitle('Guidewire Documentation | Log in');
    setBackgroundColor('hsl(0, 0%, 98%)');
  }, [setBackgroundColor, setHeaderOptions, setTitle]);

  return (
    <Grid
      container
      direction="column"
      flexWrap="wrap"
      alignItems="center"
      sx={{ width: '100%' }}
    >
      <Grid
        container
        direction="row"
        sx={{
          background: 'linear-gradient(to right, #324c76, #719fe8)',
          flexWrap: { xs: 'wrap', sm: 'nowrap', md: 'wrap' },
          height: '400px',
          width: '100%',
          padding: '1rem',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            margin: 0,
            display: 'block',
            width: { xs: '100%', sm: '30%', md: '40%' },
            fontSize: { xs: 30, sm: 30, lg: 40 },
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
            minWidth: '100px',
            minHeight: '100px',
            padding: '0 2rem',
          }}
        />
      </Grid>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ padding: '2rem 1rem', width: '100%' }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '1.5rem',
            color: 'hsl(216, 42%, 13%)',
            textAlign: 'center',
            paddingBottom: '30px',
            width: '100%',
          }}
        >
          Browse through the{' '}
          <Link component={RouterLink} to="/apiReferences">
            latest API References
          </Link>
        </Typography>
        <Paper
          elevation={2}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            gap: '8px',
            padding: { xs: 0, sm: 4 },
            width: 'fit-content',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '1.375rem',
              color: 'hsl(216, 42%, 13%)',
              textAlign: 'center',
              padding: '5px 10px',
              marginBottom: '55px',
            }}
          >
            To view complete documentation, log in to your account
          </Typography>
          <LoginOptions />
        </Paper>
      </Grid>
    </Grid>
  );
}
