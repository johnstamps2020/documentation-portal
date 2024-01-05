import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import LanguageAdminPanel from 'components/AdminPage/LanguageAdminPage/LanguageAdminPanel';
import LanguageSettingsForm from 'components/AdminPage/LanguageAdminPage/LanguageSettingsForm';
import { useEffect } from 'react';

export default function LanguageAdminPage() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage languages');
  }, [setHeaderOptions, setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add language"
        dialogTitle="Create a new language"
        formComponent={<LanguageSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <LanguageAdminPanel />
    </>
  );
}
