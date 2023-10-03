import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AdminAccess from 'components/AdminPage/AdminAccess';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';
import ExternalLinkAdminPanel from 'components/EntitiesAdminPage/ExternalLinkAdminPage/ExternalLinkAdminPanel';
import AddButton from 'components/EntitiesAdminPage/ExternalLinkAdminPage/ExternalLinkCard/Buttons/AddButton';

export default function ExternalLinkAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage external links');
  }, [setHeaderOptions, setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <AddButton />
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
