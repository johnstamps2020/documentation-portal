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

export type FieldValue = string | boolean | undefined;

export type FieldWithValue = BatchFormField & {
  value: FieldValue;
};
