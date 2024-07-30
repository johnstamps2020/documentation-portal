import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import PlatformAdminPanel from 'components/AdminPage/PlatformAdminPage/PlatformAdminPanel';
import { useEffect } from 'react';

export default function PlatformAdminPage() {
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
