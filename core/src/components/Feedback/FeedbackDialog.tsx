import { Translate, translate } from '../../lib';
import ClearIcon from '@mui/icons-material/Clear';
import { AlertProps } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { SearchMeta, UserInformation } from '../../lib/types';
import GwBackdrop from '../GwBackdrop';
import { Anonymous } from './Anonymous';
import { PrivacyNotice } from './PrivacyNotice';

export type FeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  positive: boolean;
  userInformation: UserInformation;
  title: string;
  searchMeta: SearchMeta;
  jiraApiUrl: string;
  url: string;
  showNotification: (
    severity: AlertProps['severity'],
    message: JSX.Element
  ) => void;
  possibleContacts: string;
};

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
    Subject: string;
    URL: string;
    'Feedback type': 'Kudos' | 'Critique';
    Comment: string;
    'Reported by': string;
    'Possible contacts': string;
  };
  feedbackType: 'positive' | 'negative';
};

export function FeedbackDialog({
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
        summaryText: `Doc: user feedback: ${title}`,
        descriptionText: {
          Product: searchMeta?.product?.join(', ') || '',
          Version: searchMeta?.version?.join(', ') || '',
          Platform: searchMeta?.platform?.join(', ') || '',
          Subject: searchMeta?.subject?.join(', ') || '',
          URL: url,
          'Feedback type': positive ? 'Kudos' : 'Critique',
          Comment: comment,
          'Reported by':
            email.length > 0 && !anonymous
              ? `${email} (${email.replace('@', ' at ')})`
              : 'anonymous',
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
              description="Appears to thank the user for their feedback"
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
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailIsError(!isValidEmail(newEmail));
  }

  function isValidEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function handleClearEmail() {
    setEmail('');
    setEmailIsError(false);
  }

  function handleSubmit() {
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
              label={translate({
                id: 'feedbackDialog.comment',
                message: 'Your comment',
              })}
              multiline
              maxRows={8}
              minRows={4}
              value={comment}
              onChange={handleChangeComment}
              variant="outlined"
            />
            <TextField
              label={translate({
                id: 'feedbackDialog.email',
                message: 'Your email',
              })}
              value={email}
              onChange={handleChangeEmail}
              aria-describedby="email-helper-text"
              error={emailIsError}
              helperText={translate({
                id: 'feedbackDialog.validEmail',
                message: 'Provide a valid email address',
              })}
              variant="outlined"
              type="email"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleClearEmail}
                    aria-label={translate({
                      id: 'feedbackDialog.clearEmail',
                      message: 'Clear email',
                    })}
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
            <PrivacyNotice />
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
