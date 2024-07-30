import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import ResourceAdminPanel from './ResourceAdminPanel';
import { useEffect } from 'react';

export default function ResourceAdminPage() {
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
