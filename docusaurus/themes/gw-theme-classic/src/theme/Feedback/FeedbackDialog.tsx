import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import GwBackdrop from '../GwBackdrop';
import Anonymous from './Anonymous';
import Translate, { translate } from '@theme/Translate';
import { FeedbackDialogProps } from '@theme/Feedback';

const commentLabel = translate({
  id: 'feedbackDialog.comment',
  message: 'Your comment',
});

const emailLabel = translate({
  id: 'feedbackDialog.email',
  message: 'Your email',
});

const clearLabel = translate({
  id: 'feedbackDialog.clearEmail',
  message: 'Clear email',
});

type JiraResponse = {
  id: string;
  key: string;
  self: string;
};

type FeedbackRequestBody = {
  summaryText: string;
  descriptionText: {
    Product: string;
    Version: string;
    Platform: string;
    Category: string;
    URL: string;
    'Feedback type': 'Kudos' | 'Critique';
    Comment: string;
    'Reported by': string;
    'Possible contacts': string;
  };
  feedbackType: 'positive' | 'negative';
};

export default function FeedbackDialog({
  open,
  onClose,
  positive,
  userInformation,
  title,
  searchMeta,
  jiraApiUrl,
  url,
  showNotification,
  possibleContacts,
}: FeedbackDialogProps) {
  // State
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [emailIsError, setEmailIsError] = useState(false);
  const [sending, setSending] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  useEffect(function () {});

  function setEmailFromUserInfo() {
    if (userInformation?.preferred_username) {
      setEmail(userInformation.preferred_username);
    }
  }

  useEffect(
    function () {
      setEmailFromUserInfo();
    },
    [userInformation]
  );

  async function submitFeedback() {
    try {
      const feedbackRequest: FeedbackRequestBody = {
        summaryText: `User feedback: ${title}`,
        descriptionText: {
          Product: searchMeta?.product?.join(', ') || '',
          Version: searchMeta?.version?.join(', ') || '',
          Platform: searchMeta?.platform?.join(', ') || '',
          Category: 'Best practices',
          URL: url,
          'Feedback type': positive ? 'Kudos' : 'Critique',
          Comment: comment,
          'Reported by': email.length > 0 && !anonymous ? email : 'anonymous',
          'Possible contacts': possibleContacts,
        },
        feedbackType: positive ? 'positive' : 'negative',
      };

      setSending(true);
      const response = await fetch(jiraApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8081',
        },
        body: JSON.stringify(feedbackRequest),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to send comment: ${responseText}`);
      }

      const jsonResponse: JiraResponse = JSON.parse(responseText);

      if (!jsonResponse.key) {
        throw new Error(
          `Cannot create feedback: ${JSON.stringify(jsonResponse)}`
        );
      }

      showNotification(
        'success',
        <>
          <p>
            <Translate
              id="feedbackDialog.thanks"
              description="Appears ot thank the user for their feedback"
            >
              Thank you!
            </Translate>
          </p>
          <p>
            <Translate
              id="feedbackDialog.followUp"
              description="Explains how the support team will react to user feedback"
            >
              A member of our documentation team will review your feedback. If
              you included your email address, we might contact you if we need
              more information.
            </Translate>
          </p>
          {userInformation.hasGuidewireEmail && (
            <p>
              Created issue{' '}
              <a
                style={{ color: 'white', textDecoration: 'underline' }}
                href={`https://guidewirejira.atlassian.net/browse/${jsonResponse.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {jsonResponse.key}
              </a>
              .
            </p>
          )}
        </>
      );

      handleClose();
    } catch (err) {
      showNotification('error', <>{`${err}`}</>);
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    onClose();
  }

  function handleChangeComment(event: React.ChangeEvent<HTMLInputElement>) {
    setComment(event.target.value);
  }

  function handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handleValidateEmail() {
    if (email.length === 0) {
      setEmailIsError(false);
    } else {
      const match = email.match(/.+@.+\..+/);
      setEmailIsError(match === null);
    }
  }

  function handleClearEmail() {
    setEmail('');
    setEmailIsError(false);
  }

  function handleSubmit() {
    handleValidateEmail();
    if (emailIsError) {
      return;
    }
    submitFeedback();
  }

  function handleAnonymous(value: boolean) {
    if (value === true) {
      setEmail('');
      setAnonymous(true);
      setEmailIsError(false);
    } else {
      setAnonymous(false);
      setEmailFromUserInfo();
    }
  }

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogContent>
          <Stack spacing={2} sx={{ padding: '1rem' }}>
            <Typography variant="h5" component="div">
              <Translate
                id="feedbackDialog.anythingElse"
                description="Appears above the feedback form"
              >
                Thanks, we have recorded your vote. Do you have anything else to
                tell us?
              </Translate>
            </Typography>
            <TextField
              label={commentLabel}
              multiline
              maxRows={8}
              minRows={4}
              value={comment}
              onChange={handleChangeComment}
              variant="outlined"
            />
            <TextField
              label={emailLabel}
              value={email}
              onChange={handleChangeEmail}
              aria-describedby="email-helper-text"
              error={emailIsError}
              helperText="Provide a valid email address"
              onBlur={handleValidateEmail}
              variant="outlined"
              type="email"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleClearEmail}
                    aria-label={clearLabel}
                    disabled={anonymous}
                  >
                    <ClearIcon />
                  </IconButton>
                ),
              }}
              disabled={anonymous}
            />
            <Stack direction="row" alignItems="center">
              <Anonymous
                anonymous={anonymous}
                handleChange={handleAnonymous}
                isValid={email.length > 0 && !emailIsError}
              />
            </Stack>
            <DialogActions>
              <Button onClick={onClose} size="large" disabled={sending}>
                <Translate
                  id="feedbackDialog.cancel"
                  description="Cancel and do not send your feedback"
                >
                  Cancel
                </Translate>
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={comment.length === 0 || emailIsError || sending}
                variant="contained"
                size="large"
                className="feedbackSubmitButton"
              >
                <Translate
                  id="feedbackDialog.submit"
                  description="Send your feedback, submit your feedback to us"
                >
                  Submit
                </Translate>
              </Button>
            </DialogActions>
          </Stack>
        </DialogContent>
      </Dialog>
      <GwBackdrop open={sending} />
    </>
  );
}
