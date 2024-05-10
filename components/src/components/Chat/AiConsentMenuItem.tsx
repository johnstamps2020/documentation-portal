import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React from 'react';
import { translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';
import { useEnvStore } from '../../stores/envStore';
import MenuItem from '@mui/material/MenuItem';

export function AiConsentMenuItem() {
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

  return (
    <MenuItem
      component={FormControlLabel}
      control={
        <Switch
          checked={aIConsented}
          onChange={() => {
            setAIConsented(!aIConsented);
          }}
        />
      }
      label={aiLabel}
    />
  );
}
