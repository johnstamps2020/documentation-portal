import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useProducts } from '@doctools/server';
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
      entities={products.map(({ name, ...rest }) => ({
        label: name,
        name: name,
        ...rest,
      }))}
      DuplicateButton={DuplicateButton}
      FormComponent={ProductSettingsForm}
      EntityCardContents={ProductCardContents}
    />
  );
}
