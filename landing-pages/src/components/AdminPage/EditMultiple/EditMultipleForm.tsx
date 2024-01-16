import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import AdminFormWrapper from '../AdminFormWrapper';
import { useAdminViewContext } from '../AdminViewContext';
import EditMultipleDiffTable, { DiffTableRow } from './EditMultipleDiffTable';
import EditMultipleFields from './EditMultipleFields';
import {
  BatchFormField,
  FieldType,
  FieldValue,
  FieldWithValue,
} from './editMultipleTypes';

function getBooleanValueAsString(value: boolean | undefined) {
  if (value === undefined) {
    return 'unset';
  }

  return value ? 'true' : 'false';
}

function getStringValueAsBoolean(value: string) {
  if (value === 'unset') {
    return undefined;
  }

  return value === 'true';
}

function getDisplayValue(type: FieldType, value: FieldValue): string {
  if (type === 'boolean') {
    return getBooleanValueAsString(value as boolean | undefined);
  }

  if (!value) {
    return '';
  }

  return value.toString();
}

function getEditableFields(entities: any[]): BatchFormField[] {
  return Object.entries(entities[0])
    .filter(([key]) => key !== 'uuid')
    .map(([key, value]) => ({
      name: key,
      type: typeof value,
    }));
}

function getDefaultValue(type: FieldType) {
  if (type === 'string') {
    return '';
  }

  if (type === 'boolean') {
    return undefined;
  }

  return undefined;
}

function getEditableFieldWithDefaultValues(
  editableFields: BatchFormField[]
): FieldWithValue[] {
  return editableFields.map(({ name, type }) => ({
    name,
    type,
    value: getDefaultValue(type),
  }));
}

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
        <Typography variant="h2">Your requested changes</Typography>
        {changedEntities.map((entity, idx) => {
          if (!entity) {
            return null;
          }
          const changedFields = formState.filter(
            (f) => f.value !== getDefaultValue(f.type)
          );

          if (changedFields.length === 0) {
            return null;
          }

          const differences = changedFields
            .map((field) => {
              if (field.value !== entity[field.name]) {
                return field;
              }

              return null;
            })
            .filter(Boolean);

          if (differences.length === 0) {
            return null;
          }

          const rows: DiffTableRow[] = differences.map((field) => ({
            name: field!.name,
            oldValue: getDisplayValue(field!.type, entity[field!.name]),
            newValue: getDisplayValue(field!.type, field!.value),
          }));

          return (
            <div key={idx}>
              <Typography variant="h3">Entity {entity?.label}</Typography>
              <EditMultipleDiffTable rows={rows} />
            </div>
          );
        })}
      </Container>
    </AdminFormWrapper>
  );
}
