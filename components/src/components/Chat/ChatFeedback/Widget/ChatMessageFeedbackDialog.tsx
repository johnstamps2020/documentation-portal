import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Translate } from '../../../../lib';
import {
  ChatbotComment,
  ChatbotMessage,
  ChatbotRequest,
} from '../../../../types';
import { postComment } from '../api';
import { ThumbDownIcon, ThumbUpIcon } from '../icons';

type ChatMessageFeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  reaction: ChatbotComment['user']['reaction'];
  chatbotComment: ChatbotComment | undefined;
};

export function ChatMessageFeedbackDialog({
  open,
  onClose,
  reaction,
  chatbotComment,
}: ChatMessageFeedbackDialogProps) {
  const [userComment, setUserComment] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    setSending(true);

    try {
      if (!chatbotComment) {
        return;
      }

      const commentData: ChatbotComment = {
        ...chatbotComment,
        user: {
          ...chatbotComment.user,
          comment: userComment,
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
        {reaction === 'positive' ? <ThumbUpIcon /> : <ThumbDownIcon />}
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
          disabled={sending || !chatbotComment}
        />
        {error.length > 0 && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={sending || !chatbotComment}
        >
          <Translate id="chatbot.feedback.dialog.send">Send</Translate>
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={sending || !chatbotComment}
        >
          <Translate id="chatbot.feedback.dialog.cancel">Cancel</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
