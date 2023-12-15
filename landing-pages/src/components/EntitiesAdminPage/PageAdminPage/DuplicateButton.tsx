import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import PageSettingsForm from 'components/EntitiesAdminPage/PageAdminPage/PageSettingsForm';
import { usePageData } from 'hooks/usePageData';
import { Page } from 'server/dist/model/entity/Page';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, pageData } = usePageData(primaryKey);

  if (isError || isLoading || !pageData) {
    return null;
  }

  function getPageDataWithoutUuid(pageData: Page) {
    const { uuid, ...rest } = pageData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate page"
      dialogTitle="Duplicate page"
      leftFormTitle="Source page"
      leftFormComponent={
        <PageSettingsForm
          initialPageData={getPageDataWithoutUuid(pageData)}
          disabled
        />
      }
      rightFormTitle="New page"
      rightFormComponent={
        <PageSettingsForm initialPageData={getPageDataWithoutUuid(pageData)} />
      }
    />
  );
}
