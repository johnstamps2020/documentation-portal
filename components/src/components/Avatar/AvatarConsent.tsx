import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import React from 'react';
import { translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';

export function AvatarConsent() {
  const aIConsented = useConsentStore((state) => state.aiConsented);
  const setAIConsented = useConsentStore((state) => state.setAIConsented);

  const aiLabel = translate({
    id: 'consent.ai',
    message: 'AI consent',
  });

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
