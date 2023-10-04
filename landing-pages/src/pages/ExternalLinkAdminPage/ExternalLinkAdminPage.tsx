import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import AdminAccess from 'components/AdminPage/AdminAccess';
import ExternalLinkAdminPanel from 'components/EntitiesAdminPage/ExternalLinkAdminPage/ExternalLinkAdminPanel';
import ExternalLinkSettingsForm from 'components/EntitiesAdminPage/ExternalLinkAdminPage/ExternalLinkSettingsForm';
import { useEffect } from 'react';

export default function ExternalLinkAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage external links');
  }, [setHeaderOptions, setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <AddButton
          buttonLabel="Add external link"
          dialogTitle="Create a new external link"
          formComponent={<ExternalLinkSettingsForm />}
        />
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ color: 'black' }}>
            {title}
          </Typography>
          <ExternalLinkAdminPanel />
        </Stack>
      </Container>
    </AdminAccess>
  );
}
