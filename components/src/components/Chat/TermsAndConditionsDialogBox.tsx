import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { Translate } from '../../lib';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type TermsAndConditionsDialogBoxProps = DialogProps & {
  handleClose: () => void;
};

export function TermsAndConditionsDialogBox({
  open,
  handleClose,
}: TermsAndConditionsDialogBoxProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Translate id="chat.termsAndConditions.title">
          title goes here
        </Translate>
      </DialogTitle>
      <DialogContent>Coming soon!</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
        >
          <Translate id="chat.termsAndConditions.close">Close</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
