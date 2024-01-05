import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useLanguageData } from 'hooks/useEntitiesData';
import { Language } from 'server/dist/model/entity/Language';
import LanguageSettingsForm from './LanguageSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, languageData } =
    useLanguageData(primaryKey);

  if (isError || isLoading || !languageData) {
    return null;
  }

  function getLanguageDataWithoutUuid(languageData: Language) {
    const { uuid, ...rest } = languageData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate language"
      dialogTitle="Duplicate language"
      leftFormTitle="Source language"
      leftFormComponent={
        <LanguageSettingsForm
          initialLanguageData={getLanguageDataWithoutUuid(
            languageData
          )}
          disabled
        />
      }
      rightFormTitle="New language"
      rightFormComponent={
        <LanguageSettingsForm
          initialLanguageData={getLanguageDataWithoutUuid(
            languageData
          )}
        />
      }
    />
  );
}
