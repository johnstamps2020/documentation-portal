import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import LanguageAdminPanel from 'components/AdminPage/LanguageAdminPage/LanguageAdminPanel';
import { useEffect } from 'react';

export default function LanguageAdminPage() {
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
