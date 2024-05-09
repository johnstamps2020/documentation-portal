import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import React, { useEffect, useState } from 'react';
import { translate } from '../../lib';
import { checkAIOptInStatus, saveAIOptInStatus } from '../Chat/ChatContext';
import FormControlLabel from '@mui/material/FormControlLabel';

export function AvatarConsent() {
  const [aIConsented, setAIConsented] = useState(checkAIOptInStatus());

  useEffect(() => {
    saveAIOptInStatus(aIConsented);
  }, [aIConsented]);

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
          disabled={aIConsented === false}
        />
      }
      label={aiLabel}
    />
  );
}
