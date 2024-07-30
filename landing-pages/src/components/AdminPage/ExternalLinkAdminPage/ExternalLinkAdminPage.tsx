import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import ExternalLinkAdminPanel from 'components/AdminPage/ExternalLinkAdminPage/ExternalLinkAdminPanel';
import { useEffect } from 'react';

export default function ExternalLinkAdminPage() {
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
