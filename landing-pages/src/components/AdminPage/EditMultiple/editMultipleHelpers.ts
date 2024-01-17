import { Entity } from '../EntityListWithFilters';
import {
  BatchFormField,
  EntityDiff,
  FieldType,
  FieldValue,
  FieldWithValue,
  RegexField,
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

export function getEntityFieldDisplayValue(fieldValue: any) {
  const type = typeof fieldValue;

  if (type === 'boolean') {
    return getBooleanValueAsString(fieldValue);
  }

  if (!fieldValue) {
    return '(empty)';
  }

  return fieldValue.toString();
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

export function getDataValue(type: FieldType, value: string): FieldValue {
  if (type === 'boolean') {
    return getStringValueAsBoolean(value);
  }

  return value;
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

export function getUpdatedFieldValue(formField: FieldWithValue, value: string) {
  if (formField.type === 'string') {
    const regularExpression = new RegExp(
      (formField.value as RegexField)?.regex,
      'g'
    );
    const replaceWith: string =
      (formField.value as RegexField)?.replaceWith || '';
    const updatedValue = value.replace(regularExpression, replaceWith);

    return updatedValue;
  }

  if (formField.type === 'boolean') {
    return getStringValueAsBoolean(value);
  }
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

export function getEntityDiff(
  selectedEntities: Entity[],
  changedFields: FieldWithValue[]
): EntityDiff[] | null {
  if (selectedEntities.length === 0) {
    return null;
  }

  const items: EntityDiff[] = [];

  for (const entity of selectedEntities) {
    const fieldUpdatesForEntity = [];
    for (const changedField of changedFields) {
      const oldValue = entity[changedField.name];
      const newValue = getUpdatedFieldValue(changedField, oldValue);

      if (oldValue !== newValue) {
        fieldUpdatesForEntity.push({
          ...entity,
          [changedField.name]: newValue,
        });
      }
    }

    if (fieldUpdatesForEntity.length > 0) {
      items.push({
        oldEntity: { ...entity },
        newEntity: {
          ...entity,
          ...fieldUpdatesForEntity.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          ),
        },
      });
    }
  }

  if (items.length === 0) {
    return null;
  }

  return items;
}
