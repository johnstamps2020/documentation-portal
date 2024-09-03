import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import SubjectAdminPanel from 'components/AdminPage/SubjectAdminPage/SubjectAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/subject')({
  component: SubjectAdminPage,
});

function SubjectAdminPage() {
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
