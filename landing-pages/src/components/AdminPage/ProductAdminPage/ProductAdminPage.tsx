import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import ProductAdminPanel from 'components/AdminPage/ProductAdminPage/ProductAdminPanel';
import { useEffect } from 'react';

export default function ProductAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage products');
  }, [setTitle]);

  return (
    <>
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ProductAdminPanel />
    </>
  );
}
