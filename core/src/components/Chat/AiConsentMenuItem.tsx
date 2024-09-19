import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import React, { useState } from 'react';
import { translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';
import { useEnvStore } from '../../stores/envStore';
import { TermsAndConditionsDialogBox } from './TermsAndConditionsDialogBox';

export function AiConsentMenuItem() {
  const [open, setOpen] = useState(false);
  const aIConsented = useConsentStore((state) => state.aiConsented);
  const setAIConsented = useConsentStore((state) => state.setAIConsented);
  const envName = useEnvStore((state) => state.envName);

  const aiLabel = translate({
    id: 'consent.ai',
    message: 'AI consent',
  });

  if (envName !== 'dev') {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (aIConsented) {
      setAIConsented(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <MenuItem>
      <FormControlLabel
        control={<Switch checked={aIConsented} onChange={handleChange} />}
        label={aiLabel}
      />
      <TermsAndConditionsDialogBox
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
    </MenuItem>
  );
}
