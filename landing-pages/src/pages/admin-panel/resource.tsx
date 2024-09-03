import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import ResourceAdminPanel from '../../components/AdminPage/ResourceAdminPage/ResourceAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/resource')({
  component: ResourceAdminPage,
});

function ResourceAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage Resources');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ResourceAdminPanel />
    </>
  );
}
