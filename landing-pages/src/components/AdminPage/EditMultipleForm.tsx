import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import AdminFormWrapper from './AdminFormWrapper';
import { useAdminViewContext } from './AdminViewContext';

type BatchFormField = {
  name: string;
  type:
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'undefined'
    | 'object'
    | 'function';
};

type FieldWithValue = BatchFormField & {
  value: string | number | undefined;
};

function getEditableFields(entities: any[]): BatchFormField[] {
  return Object.entries(entities[0])
    .filter(([key]) => key !== 'uuid')
    .map(([key, value]) => ({
      name: key,
      type: typeof value,
    }));
}

function getDefaultValue(type: BatchFormField['type']) {
  if (type === 'string') {
    return '';
  }

  if (type === 'boolean') {
    return -1;
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
  const [modifiedEntities, setModifiedEntities] = useState(selectedEntities);
  const [formState, setFormState] = useState(
    getEditableFieldWithDefaultValues(editableFields)
  );

  function handleFieldChange(fieldName: string, fieldValue: string | boolean) {}

  return (
    <AdminFormWrapper
      disabled={false}
      dataChanged={false}
      canSubmitData={false}
      handleSave={() => {}}
      handleResetForm={() => {}}
      sx={{
        maxWidth: '100%',
        minWidth: '800px',
        alignItems: 'flex-start',
      }}
    >
      {editableFields.map(({ name, type }, idx) => {
        if (type === 'string') {
          return <TextField key={idx} label={name} name={name} fullWidth />;
        }

        if (type === 'boolean') {
          return (
            <FormControlLabel
              key={idx}
              control={
                <Select name={name} defaultValue={-1}>
                  <MenuItem value={-1}>keep as is</MenuItem>
                  <MenuItem value={1}>true</MenuItem>
                  <MenuItem value={0}>false</MenuItem>
                </Select>
              }
              label={`"${name}" set to:`}
              labelPlacement="start"
              name={name}
              sx={{
                gap: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            />
          );
        }

        return (
          <div key={idx}>
            {name}: <code>{type}</code>
          </div>
        );
      })}
    </AdminFormWrapper>
  );
}
