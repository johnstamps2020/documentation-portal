import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import ReleaseAdminPanel from 'components/AdminPage/ReleaseAdminPage/ReleaseAdminPanel';
import ReleaseSettingsForm from 'components/AdminPage/ReleaseAdminPage/ReleaseSettingsForm';
import { useEffect } from 'react';

export default function ReleaseAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage releases');
  }, [setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add release"
        dialogTitle="Create a new release"
        formComponent={<ReleaseSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ReleaseAdminPanel />
    </>
  );
}
