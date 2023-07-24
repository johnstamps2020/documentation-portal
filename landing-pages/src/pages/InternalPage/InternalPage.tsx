import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useUserInfo } from 'hooks/useApi';
import Button from '@mui/material/Button';
import { useLayoutContext } from '../../LayoutContext';
import { useEffect } from 'react';
import ServerMessagePage from 'pages/ServerMessagePage';

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
  const { setTitle } = useLayoutContext();

  useEffect(() => {
    setTitle('Internal page');
  }, [setTitle]);

  if (isError || isLoading || !userInfo) {
    return null;
  }

  const restrictedParam = new URLSearchParams(window.location.search).get(
    'restricted'
  );

  if (!userInfo) {
    return null;
  }

  const informationToDisplay = userInfo.hasGuidewireEmail ? (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        Sorry for the inconvenience
      </Typography>
      <Typography>
        You are a Guidewire employee but for some reason you cannot access this
        page.
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
        {userInfo.isLoggedIn && (
          <>
            <Typography>
              You are logged in as <strong>{userInfo.name}</strong> (
              {userInfo.preferred_username}) and you do not have access.
            </Typography>
            <Button
              href="/gw-logout"
              variant="contained"
              sx={{ width: 'fit-content', alignSelf: 'center' }}
            >
              Log out
            </Button>
          </>
        )}
        <Typography>
          To view this page, you must log in with your Guidewire employee
          account. If you need further help, please contact your administrator.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      <ServerMessagePage
        informationToDisplay={informationToDisplay}
        backgroundImage="url(/images/internal-page.svg)"
      />
    </>
  );
}
