import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import VersionAdminPanel from 'components/AdminPage/VersionAdminPage/VersionAdminPanel';
import { useEffect } from 'react';

export default function VersionAdminPage() {
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
