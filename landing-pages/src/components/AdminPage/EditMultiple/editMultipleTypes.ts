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

export type BooleanField = boolean | undefined;

export type FieldValue = RegexField | BooleanField;

export type FieldWithValue = BatchFormField & {
  value: FieldValue;
};

export type EntityDiff = {
  oldEntity: Entity;
  newEntity: Entity;
};
