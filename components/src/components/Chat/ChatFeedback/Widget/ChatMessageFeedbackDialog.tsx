import Dialog from '@mui/material/Dialog';
import React, { useState } from 'react';
import {
  ChatbotComment,
  ChatbotMessage,
  ChatbotRequest,
} from '../../../../types';
import DialogTitle from '@mui/material/DialogTitle';
import { Translate } from '../../../../lib';
import { ThumbUpIcon, ThumbDownIcon } from '../icons';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { postComment } from '../api';

type ChatMessageFeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  reaction: ChatbotComment['user']['reaction'];
  chatbotRequest: ChatbotRequest;
  chatbotMessage: ChatbotMessage;
};

function makeHash(message: string) {
  var hash = 0,
    i,
    chr;
  if (message.length === 0) return hash;
  for (i = 0; i < message.length; i++) {
    chr = message.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  if (hash < 0) {
    return hash * -1;
  }

  return hash;
}

export function ChatMessageFeedbackDialog({
  open,
  onClose,
  reaction,
  chatbotMessage,
  chatbotRequest,
}: ChatMessageFeedbackDialogProps) {
  const [userComment, setUserComment] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    setSending(true);

    try {
      const currentMillisecondsFromEpoch = new Date().getTime();
      const id = `${currentMillisecondsFromEpoch}-${Math.floor(
        Math.random() * 1000
      )}-${makeHash(chatbotRequest.query)}`;
      const commentData: ChatbotComment = {
        context: {
          chatbotMessage,
          chatbotRequest,
          date: currentMillisecondsFromEpoch,
        },
        id,
        status: 'active',
        user: {
          reaction,
          comment: userComment,
          email: 'coming soon!',
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
          disabled={sending}
        />
        {error.length > 0 && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={userComment.length === 0 || sending}
        >
          <Translate id="chatbot.feedback.dialog.send">Send</Translate>
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={sending}>
          <Translate id="chatbot.feedback.dialog.cancel">Cancel</Translate>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
