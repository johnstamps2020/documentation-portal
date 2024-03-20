import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import AdminAccess from 'components/AdminPage/AdminAccess';
import ResourceAdminPanel from './ResourceAdminPanel';
import ResourceSettingsForm from './ResourceSettingsForm';
import { useEffect } from 'react';

export default function ResourceAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage Resources');
  }, [setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <AddButton
          buttonLabel="Add resource"
          dialogTitle="Create a new resource"
          formComponent={<ResourceSettingsForm />}
        />
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ color: 'black' }}>
            {title}
          </Typography>
          <ResourceAdminPanel />
        </Stack>
      </Container>
    </AdminAccess>
  );
}
