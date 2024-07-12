import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import ExternalLinkAdminPanel from 'components/AdminPage/ExternalLinkAdminPage/ExternalLinkAdminPanel';
import ExternalLinkSettingsForm from 'components/AdminPage/ExternalLinkAdminPage/ExternalLinkSettingsForm';
import { useEffect } from 'react';

export default function ExternalLinkAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage external links');
  }, [setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add external link"
        dialogTitle="Create a new external link"
        formComponent={<ExternalLinkSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ExternalLinkAdminPanel />
    </>
  );
}
