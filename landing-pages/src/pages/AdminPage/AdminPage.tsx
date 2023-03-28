import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Layout from 'components/Layout/Layout';
import { Link as RouterLink } from 'react-router-dom';
import AdminAccess from '../../components/AdminPage/AdminAccess';

type AdminLink = {
  path: string;
  title: string;
};

const links: AdminLink[] = [
  {
    path: '/admin/page',
    title: 'Manage pages',
  },
  {
    path: '/admin/doc',
    title: 'Manage docs, builds, and sources',
  },
];

export default function AdminPage() {
  const adminPanelTitle = 'Admin panel';
  return (
    <Layout title={adminPanelTitle} backgroundColor="gray">
      <AdminAccess pagePath={window.location.href}>
        <Container sx={{ padding: '3rem 0' }}>
          <Typography variant="h1">{adminPanelTitle}</Typography>
          <Stack spacing={2} direction="row" sx={{ padding: '2rem 0' }}>
            {links.map(({ title, path }) => (
              <Link key={path} component={RouterLink} to={path}>
                <Card sx={{ padding: '2rem 3rem' }}>{title}</Card>
              </Link>
            ))}
          </Stack>
        </Container>
      </AdminAccess>
    </Layout>
  );
}
