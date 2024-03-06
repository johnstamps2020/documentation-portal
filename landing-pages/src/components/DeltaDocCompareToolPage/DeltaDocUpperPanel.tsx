import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';

const releaseDates = [
  { release: 'Kufri', date: '202406' },
  { release: 'Jasper', date: '202402' },
  { release: 'Innsbruck', date: '202310' },
  { release: 'Hakuba', date: '202306' },
  { release: 'Garmisch', date: '202302' },
  { release: 'Flaine', date: '202209' },
  { release: 'Elysian', date: '202205' },
  { release: 'Dobson', date: '202111' },
  { release: 'Cortina', date: '202104' },
];

export default function DeltaDocUpperPanel() {
  const [leftUrl, setLeftUrl] = useState('');
  const [rightUrl, setRightUrl] = useState('');
  const [temporaryReleaseA, setTemporaryReleaseA] = useState('');
  const [temporaryReleaseB, setTemporaryReleaseB] = useState('');
  const [leftWarningMessage, setLeftWarningMessage] = useState('');
  const [rightWarningMessage, setRightWarningMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { setFormState, setRootUrls } = useDeltaDocContext();

  const versionWarningMessage = `This URL does not match any release. Please make sure the URL is correct. 
  If the URL is correct, this tool does not support this versioning system.`;

  const urlValidation =
    leftUrl !== rightUrl && rightUrl.length > 0 && leftUrl.length > 0;

  const releaseValidation =
    temporaryReleaseA &&
    temporaryReleaseB &&
    temporaryReleaseA.length > 0 &&
    temporaryReleaseB.length > 0;

  const canSubmit = urlValidation && releaseValidation;

  function handleUrl(
    url: string,
    setRelease: (value: React.SetStateAction<string>) => void,
    setHelperTextMessage: (value: React.SetStateAction<string>) => void
  ) {
    const urlVersionNumber = /\d+/.exec(url);
    if (urlVersionNumber) {
      const version = releaseDates.find((object) => {
        return object.date === urlVersionNumber[0];
      });
      if (version) {
        setRelease(version.release);
        setHelperTextMessage(
          `This document belongs to release: ${version.release}.`
        );
        setAlertMessage('');
      } else {
        if (urlVersionNumber.toString().length === 5 && url.includes('/in/')) {
          setHelperTextMessage(
            'Documents with 5-digit versioning are not supported.'
          );
        } else if (urlVersionNumber.toString().length === 12443) {
          setHelperTextMessage('No support for Jutro');
        } else {
          setHelperTextMessage('This version is not connected to any release.');
          setAlertMessage(
            `Version provided in URL does not match any release.`
          );
        }
        setRelease('');
      }
    } else {
      !urlVersionNumber && setHelperTextMessage(versionWarningMessage);
    }
    url === '' && setHelperTextMessage('');
  }

  useEffect(() => {
    handleUrl(leftUrl, setTemporaryReleaseA, setLeftWarningMessage);
    handleUrl(rightUrl, setTemporaryReleaseB, setRightWarningMessage);
  }, [
    leftUrl,
    setLeftUrl,
    rightUrl,
    setRightUrl,
    canSubmit,
    temporaryReleaseA,
    temporaryReleaseB,
  ]);

  function handleSubmit() {
    const leftRootUrl = /\/cloud\/.*/.exec(leftUrl);
    const rightRootUrl = /\/cloud\/.*/.exec(rightUrl);
    setFormState({
      releaseA: temporaryReleaseA ? temporaryReleaseA : '',
      releaseB: temporaryReleaseB ? temporaryReleaseB : '',
      url: leftRootUrl ? leftRootUrl[0] : '', //runs query on one of the urls since they're the same
    });
    setRootUrls({
      leftUrl: leftRootUrl ? leftRootUrl[0] : '',
      rightUrl: rightRootUrl ? rightRootUrl[0] : '',
    });
  }

  return (
    <Container>
      <Stack spacing={2} sx={{ py: '1rem' }}>
        <FormControl sx={{ alignItems: 'center' }}>
          <Stack
            direction="row"
            height="200px"
            alignItems="center"
            alignSelf="center"
          >
            <Stack padding={3}>
              <TextField
                label="First URL"
                value={leftUrl}
                sx={{ width: '450px' }}
                onChange={(event) => setLeftUrl(event.target.value as string)}
              />
              <FormHelperText
                sx={{ fontSize: '14px', height: '30px', maxWidth: '420px' }}
              >
                {leftWarningMessage}
              </FormHelperText>
            </Stack>
            <Stack padding={3}>
              <TextField
                label="Second URL"
                value={rightUrl}
                sx={{ width: '450px' }}
                onChange={(event) => setRightUrl(event.target.value as string)}
              />
              <FormHelperText
                sx={{ fontSize: '14px', height: '30px', maxWidth: '420px' }}
              >
                {rightWarningMessage}
              </FormHelperText>
            </Stack>
          </Stack>
          <Stack sx={{ height: '50px' }}>
            {leftUrl === rightUrl &&
              leftUrl.length !== 0 &&
              rightUrl.length !== 0 && (
                <Alert severity="error">
                  The urls you provided are the same.
                </Alert>
              )}
            {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
          </Stack>
          <Button
            variant="contained"
            sx={{ mt: '12px', width: '250px' }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            See results
          </Button>
        </FormControl>
      </Stack>
    </Container>
  );
}
