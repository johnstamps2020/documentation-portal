import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { BatchFormField } from './editMultipleTypes';

type EditMultipleFieldsProps = {
  editableFields: BatchFormField[];
  handleFieldChange: any;
  getCurrentValue: any;
};

export default function EditMultipleFields({
  editableFields,
  getCurrentValue,
  handleFieldChange,
}: EditMultipleFieldsProps) {
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
              onChange={(e) => handleFieldChange(name, type, e.target.value)}
              value={getCurrentValue(name, type)}
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
                  value={getCurrentValue(name, type)}
                  onChange={(e) =>
                    handleFieldChange(name, type, e.target.value as string)
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
