import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import ExternalLinkAdminPanel from 'components/AdminPage/ExternalLinkAdminPage/ExternalLinkAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/external-link')({
  component: ExternalLinkAdminPage,
});

function ExternalLinkAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage external links');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ExternalLinkAdminPanel />
    </>
  );
}
