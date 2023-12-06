import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import AdminAccess from 'components/AdminPage/AdminAccess';
import SourceAdminPanel from 'components/EntitiesAdminPage/SourceAdminPage/SourceAdminPanel';
import SourceSettingsForm from 'components/EntitiesAdminPage/SourceAdminPage/SourceSettingsForm';
import { useEffect } from 'react';

export default function SourceAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage sources');
  }, [setHeaderOptions, setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <AddButton
          buttonLabel="Add source"
          dialogTitle="Create a new source"
          formComponent={<SourceSettingsForm />}
        />
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ color: 'black' }}>
            {title}
          </Typography>
          <SourceAdminPanel />
        </Stack>
      </Container>
    </AdminAccess>
  );
}
