import { createContext, useContext, useState } from 'react';
import { useAdminViewContext } from '../AdminViewContext';
import {
  getDataValue,
  getDefaultValue,
  getDisplayValue,
  getEditableFieldWithDefaultValues,
  getEditableFields,
  getEntityDiff,
} from './editMultipleHelpers';
import {
  BatchFormField,
  EntityDiff,
  FieldValue,
  FieldWithValue,
} from './editMultipleTypes';

export interface EditMultipleContextProps {
  thereAreChanges: boolean;
  handleResetForm: () => void;
  editableFields: BatchFormField[];
  handleFieldChange: (fieldName: string, newValue: FieldValue) => void;
  getCurrentDisplayValue: (fieldName: string) => string;
  entityDiffList: EntityDiff[];
  changedFields: FieldWithValue[];
}

export const EditMultipleContext = createContext<
  EditMultipleContextProps | undefined
>(undefined);

export function EditMultipleContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedEntities } = useAdminViewContext();
  const editableFields = getEditableFields(selectedEntities);
  const [formState, setFormState] = useState(
    getEditableFieldWithDefaultValues(editableFields)
  );

  function handleResetForm() {
    setFormState(getEditableFieldWithDefaultValues(editableFields));
  }

  function getCurrentDisplayValue(fieldName: string): string {
    const field = formState.find((f) => f.name === fieldName);
    if (!field) {
      return '';
    }

    return getDisplayValue(field.type, field.value);
  }

  function handleFieldChange(fieldName: string, fieldValue: FieldValue): void {
    setFormState((prev) =>
      prev.map((f) => {
        if (fieldValue && f.name === fieldName) {
          return {
            ...f,
            value: getDataValue(f.type, fieldValue),
          };
        }

        return f;
      })
    );
  }

  const changedFields = formState.filter((f) => {
    const defaultValue = getDefaultValue(f.type);
    const currentValue = f.value;
    const compareResult =
      JSON.stringify(defaultValue) !== JSON.stringify(currentValue);

    return compareResult;
  });
  console.log({ changedFields });

  const entityDiffList = getEntityDiff(selectedEntities, changedFields) || [];

  const thereAreChanges =
    entityDiffList && entityDiffList.length > 0 ? true : false;

  return (
    <EditMultipleContext.Provider
      value={{
        thereAreChanges,
        handleResetForm,
        editableFields,
        handleFieldChange,
        getCurrentDisplayValue,
        entityDiffList,
        changedFields,
      }}
    >
      {children}
    </EditMultipleContext.Provider>
  );
}

export function useEditMultipleContext() {
  const context = useContext(EditMultipleContext);

  if (!context) {
    throw new Error(
      'useEditMultipleContext must be used within EditMultipleContextProvider'
    );
  }

  return context;
}
