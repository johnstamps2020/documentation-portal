import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import SourceAdminPanel from 'components/AdminPage/SourceAdminPage/SourceAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/source')({
  component: SourceAdminPage,
});

function SourceAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage sources');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <SourceAdminPanel />
    </>
  );
}
