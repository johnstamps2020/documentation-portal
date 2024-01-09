import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import PlatformAdminPanel from 'components/AdminPage/PlatformAdminPage/PlatformAdminPanel';
import PlatformSettingsForm from 'components/AdminPage/PlatformAdminPage/PlatformSettingsForm';
import { useEffect } from 'react';

export default function PlatformAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage platforms');
  }, [setHeaderOptions, setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add platform"
        dialogTitle="Create a new platform"
        formComponent={<PlatformSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <PlatformAdminPanel />
    </>
  );
}
