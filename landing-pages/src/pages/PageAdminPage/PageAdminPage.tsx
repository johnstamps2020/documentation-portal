import PageAdminPanel from 'components/PageAdminPage/PageAdminPanel';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AdminAccess from 'components/AdminPage/AdminAccess';
import AddButton from 'components/PageAdminPage/PageCard/Buttons/AddButton';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

export default function PageAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage pages');
  }, [setHeaderOptions, setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <AddButton />
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ color: 'black' }}>
            {title}
          </Typography>
          <PageAdminPanel />
        </Stack>
      </Container>
    </AdminAccess>
  );
}
