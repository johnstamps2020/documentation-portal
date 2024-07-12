import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import SubjectAdminPanel from 'components/AdminPage/SubjectAdminPage/SubjectAdminPanel';
import SubjectSettingsForm from 'components/AdminPage/SubjectAdminPage/SubjectSettingsForm';
import { useEffect } from 'react';

export default function SubjectAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage subjects');
  }, [setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add subject"
        dialogTitle="Create a new subject"
        formComponent={<SubjectSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <SubjectAdminPanel />
    </>
  );
}
