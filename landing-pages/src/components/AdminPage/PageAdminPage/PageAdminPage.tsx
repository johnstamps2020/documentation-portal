import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import PageAdminPanel from 'components/AdminPage/PageAdminPage/PageAdminPanel';
import { useEffect } from 'react';

export default function PageAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage pages');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <PageAdminPanel />
    </>
  );
}
