import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { Translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';

type TermsAndConditionsDialogBoxProps = DialogProps & {
  handleClose: () => void;
};

export function TermsAndConditionsDialogBox({
  open,
  handleClose,
}: TermsAndConditionsDialogBoxProps) {
  const setAIConsented = useConsentStore((state) => state.setAIConsented);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Translate id="chat.termsAndConditions.title">
          title goes here
        </Translate>
      </DialogTitle>
      <DialogContent>
        <Translate id="chat.termsAndConditions.body">body goes here</Translate>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setAIConsented(true);
            handleClose();
          }}
          variant="contained"
        >
          <Translate id="chat.termsAndConditions.close">Got it</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
