import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import VersionAdminPanel from 'components/AdminPage/VersionAdminPage/VersionAdminPanel';
import VersionSettingsForm from 'components/AdminPage/VersionAdminPage/VersionSettingsForm';
import { useEffect } from 'react';

export default function VersionAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage versions');
  }, [setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add version"
        dialogTitle="Create a new version"
        formComponent={<VersionSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <VersionAdminPanel />
    </>
  );
}
