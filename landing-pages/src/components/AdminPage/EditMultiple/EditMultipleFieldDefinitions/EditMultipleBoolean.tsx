import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEditMultipleContext } from '../EditMultipleContext';
import { useState } from 'react';

type EditMultipleBooleanProps = {
  name: string;
};

function getStringValueAsBoolean(value: string) {
  if (value === 'unset') {
    return undefined;
  }

  return value === 'true';
}

function getBooleanValueAsString(value: boolean | undefined) {
  if (value === undefined) {
    return 'unset';
  }

  return value ? 'true' : 'false';
}

export default function EditMultipleBoolean({
  name,
}: EditMultipleBooleanProps) {
  const { getCurrentFieldValue, handleFieldChange } = useEditMultipleContext();
  const currentValue = getCurrentFieldValue(name);
  const displayValue = getBooleanValueAsString(currentValue as boolean);
  const [stringValue, setStringValue] = useState(displayValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valueToApply = getStringValueAsBoolean(e.target.value);
    handleFieldChange(name, valueToApply);
    setStringValue(e.target.value);
  }

  return (
    <FormControlLabel
      control={
        <RadioGroup
          name={name}
          value={stringValue}
          onChange={handleChange}
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
      }}
    />
  );
}
