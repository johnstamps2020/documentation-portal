import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDocContext } from '@theme/DocContext';
import mockUserData from '@theme/mockUserData';
import React from 'react';

export default function ExternalUserCheckbox() {
  const { setUserInformation, userInformation } = useDocContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      setUserInformation(mockUserData.external);
    } else {
      setUserInformation(mockUserData.internal);
    }
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={!userInformation.hasGuidewireEmail}
          onChange={handleChange}
        />
      }
      label="View as external user"
    />
  );
}
