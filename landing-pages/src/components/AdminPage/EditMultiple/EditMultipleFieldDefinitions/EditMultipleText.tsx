import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEditMultipleContext } from '../EditMultipleContext';
import { RegexField } from '../editMultipleTypes';

type EditMultipleTextProps = {
  name: string;
};

export default function EditMultipleText({ name }: EditMultipleTextProps) {
  const { handleFieldChange, getCurrentValue } = useEditMultipleContext();

  function handleChange(value: string, fieldName: 'regex' | 'replaceWith') {
    handleFieldChange(name, {
      ...(getCurrentValue(name) as RegexField),
      [fieldName]: value,
    });
  }

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: '16px',
        paddingLeft: '16px',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ flex: 1 }}>{name}:</Typography>
      <TextField
        label="regex"
        sx={{ flex: 2 }}
        value={(getCurrentValue(name) as RegexField)?.regex}
        onChange={(e) => handleChange(e.target.value, 'regex')}
      />
      <TextField
        label="replace with"
        sx={{ flex: 2 }}
        value={(getCurrentValue(name) as RegexField)?.replaceWith}
        onChange={(e) => handleChange(e.target.value, 'replaceWith')}
      />
    </Stack>
  );
}
