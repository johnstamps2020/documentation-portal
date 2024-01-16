import { createContext, useContext, useState } from 'react';
import { Entity } from '../EntityListWithFilters';
import {
  BatchFormField,
  FieldValue,
  FieldWithValue,
} from './editMultipleTypes';
import { useAdminViewContext } from '../AdminViewContext';
import {
  getDataValue,
  getDefaultValue,
  getDisplayValue,
  getEditableFieldWithDefaultValues,
  getEditableFields,
} from './editMultipleHelpers';

interface EditMultipleContextProps {
  thereAreChanges: boolean;
  handleResetForm: () => void;
  editableFields: BatchFormField[];
  handleFieldChange: (fieldName: string, newValue: string) => void;
  getCurrentDisplayValue: (fieldName: string) => string;
  changedEntities: Entity[];
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

  function handleFieldChange(fieldName: string, fieldValue: FieldValue) {
    setFormState((prev) =>
      prev.map((f) => {
        if (fieldValue && f.name === fieldName) {
          return {
            ...f,
            value: getDataValue(f.type, fieldValue.toString()),
          };
        }

        return f;
      })
    );
  }

  const changedFields = formState.filter(
    (f) => f.value !== getDefaultValue(f.type)
  );

  const changedEntities = selectedEntities
    .map((entity) => {
      if (changedFields.length === 0) {
        return null;
      }

      const changedFieldsInEntity = changedFields
        .map((field) => {
          if (field.value !== entity[field.name]) {
            return field;
          }

          return null;
        })
        .filter(Boolean);

      return changedFieldsInEntity.length > 0 ? entity : null;
    })
    .filter(Boolean) as Entity[];

  const thereAreChanges = changedEntities.length > 0;

  return (
    <EditMultipleContext.Provider
      value={{
        thereAreChanges,
        handleResetForm,
        editableFields,
        handleFieldChange,
        getCurrentDisplayValue,
        changedEntities,
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
