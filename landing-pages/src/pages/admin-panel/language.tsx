import { createFileRoute } from '@tanstack/react-router';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import LanguageAdminPanel from 'components/AdminPage/LanguageAdminPage/LanguageAdminPanel';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin-panel/language')({
  component: LanguageAdminPage,
});

function LanguageAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage languages');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <LanguageAdminPanel />
    </>
  );
}
