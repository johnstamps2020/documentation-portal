import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Translate } from '../../../../lib';
import { ChatbotComment } from '../../../../types';
import { postComment } from '../api';
import { useChatFeedback } from './ChatFeedbackContext';

type ChatMessageFeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  reactionToSave: ChatbotComment['user']['reaction'];
};

export function ChatMessageFeedbackDialog({
  open,
  onClose,
  reactionToSave,
}: ChatMessageFeedbackDialogProps) {
  const [userComment, setUserComment] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { chatComment } = useChatFeedback();

  async function handleSubmit() {
    setError('');
    setSending(true);

    try {
      if (!chatComment) {
        return;
      }

      const commentData: ChatbotComment = {
        ...chatComment,
        user: {
          ...chatComment.user,
          comment: userComment,
          reaction: reactionToSave,
        },
      };

      const problem = await postComment(commentData);

      if (problem) {
        setError(problem);
      }

      onClose();
    } catch (err) {
      setError(`${err}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (sending) {
          return;
        }
        onClose();
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Translate id="chatbot.feedback.dialog.title">
          Would you like to leave a comment?
        </Translate>
      </DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={userComment}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUserComment(event.target.value);
          }}
          disabled={sending || !chatComment}
        />
        {error.length > 0 && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={sending || !chatComment}
        >
          <Translate id="chatbot.feedback.dialog.send">Send</Translate>
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={sending || !chatComment}
        >
          <Translate id="chatbot.feedback.dialog.cancel">Cancel</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
