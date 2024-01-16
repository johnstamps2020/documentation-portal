import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleBoolean from './EditMultipleFieldDefinitions/EditMultipleBoolean';

export default function EditMultipleFields() {
  const { editableFields, handleFieldChange, getCurrentDisplayValue } =
    useEditMultipleContext();

  return (
    <Stack sx={{ gap: '16px', pb: '64px' }}>
      {editableFields.map(({ name, type }, idx) => {
        if (type === 'string') {
          return (
            <TextField
              key={idx}
              label={name}
              name={name}
              fullWidth
              onChange={(e) => handleFieldChange(name, e.target.value)}
              value={getCurrentDisplayValue(name)}
            />
          );
        }

        if (type === 'boolean') {
          return <EditMultipleBoolean key={idx} name={name} />;
        }

        return (
          <div key={idx}>
            {name}: <code>{type}</code>
          </div>
        );
      })}
    </Stack>
  );
}
