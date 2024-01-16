import {
  BatchFormField,
  FieldType,
  FieldValue,
  FieldWithValue,
} from './editMultipleTypes';

export function getBooleanValueAsString(value: boolean | undefined) {
  if (value === undefined) {
    return 'unset';
  }

  return value ? 'true' : 'false';
}

export function getStringValueAsBoolean(value: string) {
  if (value === 'unset') {
    return undefined;
  }

  return value === 'true';
}

export function getDisplayValue(type: FieldType, value: FieldValue): string {
  if (type === 'boolean') {
    return getBooleanValueAsString(value as boolean | undefined);
  }

  if (!value) {
    return '';
  }

  return value.toString();
}

export function getEditableFields(entities: any[]): BatchFormField[] {
  return Object.entries(entities[0])
    .filter(([key]) => key !== 'uuid')
    .map(([key, value]) => ({
      name: key,
      type: typeof value,
    }));
}

export function getDefaultValue(type: FieldType) {
  if (type === 'string') {
    return '';
  }

  if (type === 'boolean') {
    return undefined;
  }

  return undefined;
}

export function getEditableFieldWithDefaultValues(
  editableFields: BatchFormField[]
): FieldWithValue[] {
  return editableFields.map(({ name, type }) => ({
    name,
    type,
    value: getDefaultValue(type),
  }));
}
