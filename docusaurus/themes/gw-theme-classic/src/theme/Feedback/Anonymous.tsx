import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Translate from '@theme/Translate';

type AnonymousProps = {
  anonymous: boolean;
  isValid: boolean;
  handleChange: (value: boolean) => void;
};

export default function Anonymous({
  anonymous,
  isValid,
  handleChange,
}: AnonymousProps) {
  if (anonymous) {
    return (
      <>
        <Typography id="email-helper-text">
          <Translate
            id="anonymous.positive"
            description="Tells the user their identity is not revealed to us"
          >
            You are anonymous,
          </Translate>
        </Typography>
        <Button onClick={() => handleChange(false)}>
          <Translate
            id="anonymous.shareEmail"
            description="The button which the user can click to reveal their email to us"
          >
            click here to share your email with us
          </Translate>
        </Button>
      </>
    );
  }

  if (!isValid) {
    return (
      <>
        <Typography id="email-helper-text">
          <Translate
            id="anonymous.enterEmail"
            description="Asks the user to type in their email address"
          >
            Enter your email address,
          </Translate>
        </Typography>
        <Button onClick={() => handleChange(true)}>
          <Translate
            id="anonymous.becomeAnonymous"
            description="Appears on the button which the user can click to stop sharing their identity with us"
          >
            click here to be anonymous
          </Translate>
        </Button>
      </>
    );
  }

  return (
    <>
      <Typography id="email-helper-text">
        <Translate
          id="anonymous.youAreSharing"
          description="Tells the user that we know their email. When they send this comment, they will send their email to us."
        >
          You are sharing your email with us,
        </Translate>
      </Typography>
      <Button onClick={() => handleChange(true)}>
        <Translate id="anonymous.becomeAnonymous">
          click here to be anonymous
        </Translate>
      </Button>
    </>
  );
}
