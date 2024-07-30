import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import SourceAdminPanel from 'components/AdminPage/SourceAdminPage/SourceAdminPanel';
import { useEffect } from 'react';

export default function SourceAdminPage() {
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
