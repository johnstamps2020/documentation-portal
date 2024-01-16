import Container from '@mui/material/Container';
import { useState } from 'react';
import AdminFormWrapper from '../AdminFormWrapper';
import { useAdminViewContext } from '../AdminViewContext';
import { Entity } from '../EntityListWithFilters';
import EditMultipleChangeList from './EditMultipleChangeList';
import EditMultipleFields from './EditMultipleFields';
import {
  getDataValue,
  getDefaultValue,
  getDisplayValue,
  getEditableFieldWithDefaultValues,
  getEditableFields,
} from './editMultipleHelpers';
import { FieldValue } from './editMultipleTypes';

export default function EditMultipleForm() {
  const { selectedEntities } = useAdminViewContext();
  const editableFields = getEditableFields(selectedEntities);
  const [formState, setFormState] = useState(
    getEditableFieldWithDefaultValues(editableFields)
  );

  function getCurrentValue(fieldName: string) {
    const field = formState.find((f) => f.name === fieldName);
    if (!field) {
      return undefined;
    }

    return getDisplayValue(field.type, field.value);
  }

  function handleFieldChange(
    fieldName: string,
    fieldValue: FieldValue
  ) {
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
    .filter(Boolean);

  const thereAreChanges = changedEntities.length > 0;

  return (
    <AdminFormWrapper
      disabled={!thereAreChanges}
      dataChanged={thereAreChanges}
      canSubmitData={thereAreChanges}
      handleSave={() => {}}
      handleResetForm={() => {}}
    >
      <Container>
        <EditMultipleFields
          editableFields={editableFields}
          getCurrentValue={getCurrentValue}
          handleFieldChange={handleFieldChange}
        />
        <EditMultipleChangeList
          changedEntities={changedEntities as Entity[]}
          changedFields={changedFields}
        />
      </Container>
    </AdminFormWrapper>
  );
}
