import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useProducts } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ProductCardContents from './ProductCardContents';
import ProductSettingsForm from './ProductSettingsForm';

export default function ProductAdminPanel() {
  const { products, isLoading, isError } = useProducts();

  if (isError || isLoading || !products) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="product"
      entityDatabaseName="Product"
      entityPrimaryKeyName="name"
      entities={products.sort((a, b) => a.name.localeCompare(b.name))}
      DuplicateButton={DuplicateButton}
      FormComponent={ProductSettingsForm}
      EntityCardContents={ProductCardContents}
    />
  );
}
