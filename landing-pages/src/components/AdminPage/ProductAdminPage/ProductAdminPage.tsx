import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AddButton from 'components/AdminPage/AddButton';
import ProductAdminPanel from 'components/AdminPage/ProductAdminPage/ProductAdminPanel';
import ProductSettingsForm from 'components/AdminPage/ProductAdminPage/ProductSettingsForm';
import { useEffect } from 'react';

export default function ProductAdminPage() {
  const { title, setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Manage products');
  }, [setTitle]);

  return (
    <>
      <AddButton
        buttonLabel="Add product"
        dialogTitle="Create a new product"
        formComponent={<ProductSettingsForm />}
      />
      <Typography variant="h1" sx={{ color: 'black' }}>
        {title}
      </Typography>
      <ProductAdminPanel />
    </>
  );
}
