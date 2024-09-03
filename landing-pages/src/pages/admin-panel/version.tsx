import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import VersionAdminPanel from 'components/AdminPage/VersionAdminPage/VersionAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/version')({
  component: VersionAdminPage,
});

function VersionAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage versions');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <VersionAdminPanel />
    </>
  );
}
