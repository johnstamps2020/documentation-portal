import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useProducts } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ProductCardContents from './ProductCardContents';
import ProductSettingsForm from './ProductSettingsForm';
import AddButton from '../AddButton';

export default function ProductAdminPanel() {
  const { products, isLoading, isError } = useProducts();

  if (isError || isLoading || !products) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add product"
        dialogTitle="Create a new product"
        formComponent={<ProductSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="product"
        entityDatabaseName="Product"
        entityPrimaryKeyName="name"
        entities={products}
        DuplicateButton={DuplicateButton}
        FormComponent={ProductSettingsForm}
        EntityCardContents={ProductCardContents}
        disabled={disabled}
      />
    </>
  );
}
