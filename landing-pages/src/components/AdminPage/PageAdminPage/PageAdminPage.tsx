import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import PageAdminPanel from 'components/AdminPage/PageAdminPage/PageAdminPanel';
import PageSettingsForm from 'components/AdminPage/PageAdminPage/PageSettingsForm';
import { useEffect } from 'react';

export default function PageAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage pages');
  }, [setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add page"
        dialogTitle="Create a new page"
        formComponent={<PageSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <PageAdminPanel />
    </>
  );
}
