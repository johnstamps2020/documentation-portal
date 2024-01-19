import { createContext, useContext, useState } from 'react';
import { useAdminViewContext } from '../AdminViewContext';
import {
  BatchFormField,
  EntityDiff,
  FieldType,
  FieldValue,
  FieldWithValue,
  RegexField,
} from './editMultipleTypes';
import { Entity } from '../EntityListWithFilters';

function getEditableFields(entities: Entity[]): BatchFormField[] {
  return Object.entries(entities[0])
    .filter(([key]) => key !== 'uuid')
    .map(([key, value]) => ({
      name: key,
      type: typeof value,
    }));
}

function getDefaultValue(type: FieldType) {
  if (type === 'string') {
    return {
      regex: '',
      replaceWith: '',
    };
  }

  if (type === 'boolean') {
    return undefined;
  }

  return undefined;
}

function getEditableFieldsWithDefaultValue(
  editableFields: BatchFormField[]
): FieldWithValue[] {
  return editableFields.map(({ name, type }) => ({
    name,
    type,
    value: getDefaultValue(type),
  }));
}

function getUpdatedFieldValue(
  fieldWithChangeToApply: FieldWithValue,
  oldValue: any
): FieldValue {
  const valueToApply = fieldWithChangeToApply.value;
  // String: apply regex
  if (fieldWithChangeToApply.type === 'string') {
    const regularExpression = new RegExp(
      (valueToApply as RegexField)?.regex,
      'g'
    );
    const replaceWith: string = (valueToApply as RegexField)?.replaceWith || '';
    const updatedValue = oldValue.replace(regularExpression, replaceWith);

    return updatedValue;
  }

  // Boolean: apply value
  return valueToApply;
}

function getEntityDiffList(
  selectedEntities: Entity[],
  changedFields: FieldWithValue[]
): EntityDiff[] | null {
  if (selectedEntities.length === 0) {
    return null;
  }

  const itemsWhichNeedChangesApplied: EntityDiff[] = [];

  for (const entity of selectedEntities) {
    let fieldUpdatesForEntity: { [key: string]: any } = {};
    for (const changedField of changedFields) {
      const oldValue = entity[changedField.name];
      const newValue = getUpdatedFieldValue(changedField, oldValue);

      if (oldValue !== newValue) {
        fieldUpdatesForEntity[changedField.name] = newValue;
      }
    }

    if (Object.keys(fieldUpdatesForEntity).length > 0) {
      itemsWhichNeedChangesApplied.push({
        oldEntity: { ...entity },
        newEntity: {
          ...entity,
          ...fieldUpdatesForEntity,
        },
      });
    }
  }

  if (itemsWhichNeedChangesApplied.length === 0) {
    return null;
  }

  return itemsWhichNeedChangesApplied;
}

export interface EditMultipleContextProps {
  thereAreChanges: boolean;
  handleResetForm: () => void;
  editableFields: BatchFormField[];
  handleFieldChange: (fieldName: string, newValue: FieldValue) => void;
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
    getEditableFieldsWithDefaultValue(editableFields)
  );

  function handleResetForm() {
    setFormState(getEditableFieldsWithDefaultValue(editableFields));
  }

  function handleFieldChange(fieldName: string, fieldValue: FieldValue): void {
    setFormState((prev) =>
      prev.map((f) => {
        if (f.name === fieldName) {
          return {
            ...f,
            value: fieldValue,
          };
        }

        return { ...f };
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

  const entityDiffList =
    getEntityDiffList(selectedEntities, changedFields) || [];

  const thereAreChanges =
    entityDiffList && entityDiffList.length > 0 ? true : false;

  return (
    <EditMultipleContext.Provider
      value={{
        thereAreChanges,
        handleResetForm,
        editableFields,
        handleFieldChange,
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
