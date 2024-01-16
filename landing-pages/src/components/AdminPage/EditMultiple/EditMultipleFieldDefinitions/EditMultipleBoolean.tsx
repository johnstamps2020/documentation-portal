import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEditMultipleContext } from '../EditMultipleContext';

type EditMultipleBooleanProps = {
  name: string;
};

export default function EditMultipleBoolean({
  name,
}: EditMultipleBooleanProps) {
  const { getCurrentDisplayValue, handleFieldChange } =
    useEditMultipleContext();

  return (
    <FormControlLabel
      control={
        <RadioGroup
          name={name}
          value={getCurrentDisplayValue(name)}
          onChange={(e) => handleFieldChange(name, e.target.value as string)}
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
