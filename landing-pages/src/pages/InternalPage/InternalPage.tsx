import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Layout from '../../components/Layout/Layout';
import { headerHeight } from '../../components/Layout/Header/Header';
import Container from '@mui/material/Container';
import { useUserInfo } from '../../hooks/useApi';
import Button from '@mui/material/Button';

type RestrictedPathProps = {
  restrictedPath: string | null;
};

function RestrictedPathElement({ restrictedPath }: RestrictedPathProps) {
  return restrictedPath ? (
    <Container
      sx={{
        padding: '0.5rem',
        border: '1px solid gray',
        borderRadius: '4px',
        maxWidth: '100%',
        overflowX: 'scroll',
      }}
    >
      <pre>{`${window.location.origin}${restrictedPath}`}</pre>
    </Container>
  ) : null;
}

export default function InternalPage() {
  const { userInfo, isError, isLoading } = useUserInfo();
  if (isError || isLoading || !userInfo) {
    return null;
  }

  const restrictedParam = new URLSearchParams(window.location.search).get(
    'restricted'
  );

  if (!userInfo) {
    return null;
  }

  return (
    <Layout title="Internal page">
      <Grid
        container
        sx={{
          minHeight: `calc(100vh - ${headerHeight})`,
          background: 'linear-gradient(135deg, white, lightblue)',
          padding: '2rem',
        }}
      >
        <Box
          sx={{
            background: 'white',
            border: '1px solid gray',
            width: { xs: '100%', sm: '100%', md: '950px', lg: '1024px' },
            height: 'fit-content',
            boxShadow: '10px 5px 12px rgba(0, 0, 0, 0.3)',
            margin: 'auto',
            padding: { xs: '1.5rem', sm: '4rem 3rem' },
          }}
        >
          <Stack spacing={4}>
            <Container
              sx={{
                backgroundImage: 'url(/images/internal-page.svg)',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                height: { xs: '150px', sm: '250px', md: '350px' },
                textAlign: 'center',
              }}
            ></Container>
            {userInfo.hasGuidewireEmail ? (
              <>
                <Typography variant="h1" sx={{ color: 'black' }}>
                  Sorry for the inconvenience
                </Typography>
                <Typography>
                  You are a Guidewire employee but for some reason you cannot
                  access this page.
                </Typography>
                <RestrictedPathElement restrictedPath={restrictedParam} />
                <Typography>
                  If you need further help, please contact your administrator.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h1" sx={{ color: 'black' }}>
                  This content is available to Guidewire employees only
                </Typography>
                <RestrictedPathElement restrictedPath={restrictedParam} />
                <Stack spacing={2}>
                  <Typography>
                    You are logged in as <strong>{userInfo.name}</strong> (
                    {userInfo.preferred_username}) and you do not have access.
                  </Typography>
                  <Typography>
                    To view this page, you must log in with your Guidewire
                    employee account. If you need further help, please contact
                    your administrator.
                  </Typography>
                </Stack>
                <Button
                  href="/gw-logout"
                  variant="contained"
                  sx={{ width: 'fit-content', alignSelf: 'center' }}
                >
                  Log out
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Grid>
    </Layout>
  );
}
