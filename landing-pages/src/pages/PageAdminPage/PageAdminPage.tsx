import Layout from 'components/Layout/Layout';
import Filters from 'components/PageAdminPage/Filters';
import PageList from 'components/PageAdminPage/PageList';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AdminAccess from '../../components/AdminPage/AdminAccess';

export default function PageAdminPage() {
  const title = 'Manage pages';
  return (
    <Layout title={title} headerOptions={{ hideSearchBox: true }}>
      <AdminAccess pagePath={window.location.pathname}>
        <Container>
          <Stack spacing={2}>
            <Typography variant="h1" sx={{ color: 'black' }}>
              {title}
            </Typography>
            <Filters />
            <PageList />
          </Stack>
        </Container>
      </AdminAccess>
    </Layout>
  );
}
