import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import ReleaseAdminPanel from 'components/AdminPage/ReleaseAdminPage/ReleaseAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/release')({
  component: ReleaseAdminPage,
});

function ReleaseAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage releases');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ReleaseAdminPanel />
    </>
  );
}
