import { Entity } from '../EntityListWithFilters';

export type FieldType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';

export type BatchFormField = {
  name: string;
  type: FieldType;
};

export type RegexField = {
  regex: string;
  replaceWith: string;
};

export type FieldValue = string | boolean | undefined | RegexField;

export type FieldWithValue = BatchFormField & {
  value: FieldValue;
};

export type EntityDiff = {
  oldEntity: Entity;
  newEntity: Entity;
};
