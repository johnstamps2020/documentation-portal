import { createFileRoute } from '@tanstack/react-router';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Link, Outlet } from '@tanstack/react-router';
import AccessControl from '../components/AccessControl/AccessControl';

type AdminLink = {
  path: string;
  title: string;
};

const links: AdminLink[] = [
  {
    path: 'page',
    title: 'Pages',
  },
  {
    path: 'external-link',
    title: 'External links',
  },
  {
    path: 'source',
    title: 'Sources',
  },
  {
    path: 'resource',
    title: 'Resources',
  },
  {
    path: 'release',
    title: 'Releases',
  },
  {
    path: 'subject',
    title: 'Subjects',
  },
  {
    path: 'language',
    title: 'Languages',
  },
  {
    path: 'platform',
    title: 'Platforms',
  },
  {
    path: 'product',
    title: 'Products',
  },
  {
    path: 'version',
    title: 'Versions',
  },
];

export const Route = createFileRoute('/admin-panel')({
  component: AdminPage,
});

function AdminPage() {
  return (
    <AccessControl accessLevel="admin" allowedOnEnvs={['dev', 'staging']}>
      <Container sx={{ padding: '3rem 0' }}>
        <Stack direction="row" sx={{ pt: '2rem', justifyContent: 'center' }}>
          {links.map(({ title, path }) => (
            <Link
              key={path}
              to={`/admin-panel/${path}`}
              activeProps={{
                style: {
                  color: 'white',
                  backgroundColor: 'black',
                  borderColor: 'black',
                  cursor: 'default',
                },
              }}
              style={{
                color: 'black',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                padding: '8px 16px',
                borderTopLeftRadius: '6px',
                borderTopRightRadius: '6px',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderColor: 'gray',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              {title}
            </Link>
          ))}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ py: '1rem' }}>
          <Outlet />
        </Stack>
      </Container>
    </AccessControl>
  );
}
