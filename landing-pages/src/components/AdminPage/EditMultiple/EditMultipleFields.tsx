import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEditMultipleContext } from './EditMultipleContext';

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
          return (
            <FormControlLabel
              key={idx}
              control={
                <RadioGroup
                  name={name}
                  value={getCurrentDisplayValue(name)}
                  onChange={(e) =>
                    handleFieldChange(name, e.target.value as string)
                  }
                  sx={{ flexDirection: 'row' }}
                >
                  <FormControlLabel
                    value="unset"
                    control={<Radio />}
                    label="keep as is"
                  />
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="set to true"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="set to false"
                  />
                </RadioGroup>
              }
              label={`"${name}":`}
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
    </Stack>
  );
}
