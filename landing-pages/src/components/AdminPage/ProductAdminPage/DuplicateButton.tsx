import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useProductData } from 'hooks/useEntitiesData';
import { Product } from 'server/dist/model/entity/Product';
import ProductSettingsForm from './ProductSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, productData } =
    useProductData(primaryKey);

  if (isError || isLoading || !productData) {
    return null;
  }

  function getProductDataWithoutUuid(productData: Product) {
    const { uuid, ...rest } = productData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate product"
      dialogTitle="Duplicate product"
      leftFormTitle="Source product"
      leftFormComponent={
        <ProductSettingsForm
          initialProductData={getProductDataWithoutUuid(
            productData
          )}
          disabled
        />
      }
      rightFormTitle="New product"
      rightFormComponent={
        <ProductSettingsForm
          initialProductData={getProductDataWithoutUuid(
            productData
          )}
        />
      }
    />
  );
}
