import { Container } from '@mui/material';
import Link from '@mui/material/Link';
import { Link as RouterLink } from '@tanstack/react-router';

type selfManagedProps = {
  pagePath: string;
  backgroundImage: string | { sm: string; xs: string };
};

export default function SelfManagedLink({
  pagePath,
  backgroundImage,
}: selfManagedProps) {
  const selfManaged = pagePath === 'selfManagedProducts';

  return (
    <Container style={{ marginLeft: 0, marginTop: 20, paddingLeft: 0 }}>
      <Link
        component={RouterLink}
        to={selfManaged ? '/' : '/selfManagedProducts'}
        underline="always"
        style={{ fontWeight: 700, fontSize: '.875rem' }}
        sx={
          backgroundImage
            ? { color: 'white', textDecorationColor: 'white' }
            : { color: 'black', textDecorationColor: 'black' }
        }
      >
        {`View ${
          selfManaged ? 'Guidewire Cloud' : 'self-managed'
        } documentation`}
      </Link>
    </Container>
  );
}
