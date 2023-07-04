import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDocContext } from '@theme/DocContext';
import React from 'react';

export default function InternalSiteCheckbox() {
  const { isInternal, setIsInternal } = useDocContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsInternal(event.target.checked);
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={isInternal} onChange={handleChange} />}
      label="Set the site as internal"
    />
  );
}
