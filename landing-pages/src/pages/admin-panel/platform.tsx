import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import PlatformAdminPanel from 'components/AdminPage/PlatformAdminPage/PlatformAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/platform')({
  component: PlatformAdminPage,
});

function PlatformAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage platforms');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <PlatformAdminPanel />
    </>
  );
}
