import Container from '@mui/material/Container';
import { useState } from 'react';
import AdminFormWrapper from '../AdminFormWrapper';
import { useAdminViewContext } from '../AdminViewContext';
import EditMultipleFields from './EditMultipleFields';
import {
  getBooleanValueAsString,
  getDefaultValue,
  getEditableFieldWithDefaultValues,
  getEditableFields,
  getStringValueAsBoolean,
} from './editMultipleHelpers';
import { BatchFormField, FieldValue } from './editMultipleTypes';
import EditMultipleChangeList from './EditMultipleChangeList';
import { Entity } from '../EntityListWithFilters';

export default function EditMultipleForm() {
  const { selectedEntities } = useAdminViewContext();
  const editableFields = getEditableFields(selectedEntities);
  const [formState, setFormState] = useState(
    getEditableFieldWithDefaultValues(editableFields)
  );

  function getCurrentValue(
    fieldName: string,
    fieldType: BatchFormField['type']
  ) {
    const field = formState.find((f) => f.name === fieldName);
    if (!field) {
      return undefined;
    }

    if (fieldType === 'boolean') {
      return getBooleanValueAsString(field.value as boolean | undefined);
    }

    return field.value;
  }

  function handleFieldChange(
    fieldName: string,
    fieldType: BatchFormField['type'],
    fieldValue: FieldValue
  ) {
    setFormState((prev) =>
      prev.map((f) => {
        if (f.name === fieldName) {
          if (fieldType === 'boolean') {
            return {
              ...f,
              value: getStringValueAsBoolean(fieldValue as string),
            };
          }

          return {
            ...f,
            value: fieldValue,
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
      sx={{
        maxWidth: '100%',
        minWidth: '800px',
        alignItems: 'flex-start',
      }}
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
