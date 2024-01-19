import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useState } from 'react';
import { useEditMultipleContext } from '../EditMultipleContext';

type EditMultipleBooleanProps = {
  name: string;
};

const defaultValue = 'keep as is';
const booleanOptions = [defaultValue, 'true', 'false'];
type BooleanControlOption = (typeof booleanOptions)[number];

function getStringValueAsBoolean(value: BooleanControlOption) {
  if (value === defaultValue) {
    return undefined;
  }

  return value === 'true';
}

export default function EditMultipleBoolean({
  name,
}: EditMultipleBooleanProps) {
  const { handleFieldChange } = useEditMultipleContext();
  const [displayValue, setDisplayValue] =
    useState<BooleanControlOption>(defaultValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplayValue(e.target.value);
    handleFieldChange(name, getStringValueAsBoolean(e.target.value));
  }

  return (
    <FormControlLabel
      control={
        <RadioGroup
          name={name}
          value={displayValue}
          onChange={handleChange}
          sx={{ flexDirection: 'row' }}
        >
          {booleanOptions.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
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
