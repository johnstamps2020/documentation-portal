import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import AdminAccess from 'components/AdminPage/AdminAccess';
import PageAdminPanel from 'components/EntitiesAdminPage/PageAdminPage/PageAdminPanel';
import PageSettingsForm from 'components/EntitiesAdminPage/PageAdminPage/PageSettingsForm';
import { useEffect } from 'react';

export default function PageAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage pages');
  }, [setHeaderOptions, setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <AddButton
          buttonLabel="Add page"
          dialogTitle="Create a new page"
          formComponent={<PageSettingsForm />}
        />
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
