import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import SubjectAdminPanel from 'components/AdminPage/SubjectAdminPage/SubjectAdminPanel';
import { useEffect } from 'react';

export default function SubjectAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage subjects');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <SubjectAdminPanel />
    </>
  );
}
