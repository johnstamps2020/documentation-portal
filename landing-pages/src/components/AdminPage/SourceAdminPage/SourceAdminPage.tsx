import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import SourceAdminPanel from 'components/AdminPage/SourceAdminPage/SourceAdminPanel';
import SourceSettingsForm from 'components/AdminPage/SourceAdminPage/SourceSettingsForm';
import { useEffect } from 'react';

export default function SourceAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage sources');
  }, [setHeaderOptions, setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add source"
        dialogTitle="Create a new source"
        formComponent={<SourceSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <SourceAdminPanel />
    </>
  );
}
