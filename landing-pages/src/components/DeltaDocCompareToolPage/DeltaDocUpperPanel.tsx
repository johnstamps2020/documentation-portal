import { Doc } from '@doctools/server';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useDeltaDocValidator } from 'hooks/useDeltaDocData';
import { useEffect, useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';

function validateUrl(
  data: Doc | undefined,
  setVersionOrRelease: (value: React.SetStateAction<string>) => void,
  setHelperTextMessage: (value: React.SetStateAction<string>) => void
) {
  if (data) {
    if (data.releases && data.releases.length !== 0) {
      const urlRelease = data.releases[0].name;
      setVersionOrRelease(urlRelease);
      setHelperTextMessage(`This document belongs to release: ${urlRelease}.`);
    } else if (
      data.platformProductVersions &&
      data.platformProductVersions[0].version
    ) {
      const urlVersion = data.platformProductVersions[0].version.name;
      setVersionOrRelease(urlVersion);
      setHelperTextMessage(`This document uses version: ${urlVersion}.`);
    } else
      setHelperTextMessage(
        `This document doesn't match any release or version.`
      );
  } else setHelperTextMessage(`No doc matches this url.`);
}

export default function DeltaDocUpperPanel() {
  const [leftUrl, setLeftUrl] = useState('');
  const [rightUrl, setRightUrl] = useState('');
  const [temporaryLeftUrl, setTemporaryLeftUrl] = useState('');
  const [temporaryRightUrl, setTemporaryRightUrl] = useState('');
  const [temporaryReleaseOrVersionA, setTemporaryReleaseOrVersionA] =
    useState('');
  const [temporaryReleaseOrVersionB, setTemporaryReleaseOrVersionB] =
    useState('');
  const [leftWarningMessage, setLeftWarningMessage] = useState('');
  const [rightWarningMessage, setRightWarningMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [submittingAlert, setSubmittingAlert] = useState(false);
  const [alert, setAlert] = useState<JSX.Element>();
  const { setFormState, setRootUrls } = useDeltaDocContext();

  function getUrlNoSlash(url: string) {
    if (url.includes('/cloud/')) {
      return /cloud\/.*/.exec(url);
    } else if (url.includes('/jutro/')) {
      return /jutro\/.*/.exec(url);
    } else if (url.includes('/self-managed/')) {
      return /self-managed\/.*/.exec(url);
    } else return url;
  }

  const leftRootUrlNoSlash = getUrlNoSlash(temporaryLeftUrl);
  const rightRootUrlNoSlash = getUrlNoSlash(temporaryRightUrl);

  const { docData: leftDocData } = useDeltaDocValidator(
    leftRootUrlNoSlash ? leftRootUrlNoSlash[0].slice(0, -1) : ''
  );

  const { docData: rightDocData } = useDeltaDocValidator(
    rightRootUrlNoSlash ? rightRootUrlNoSlash[0].slice(0, -1) : ''
  );

  const urlIsNotEmpty =
    temporaryRightUrl.length !== 0 && temporaryLeftUrl.length !== 0;

  const urlValidation =
    temporaryLeftUrl !== temporaryRightUrl &&
    (temporaryLeftUrl !== leftUrl || temporaryRightUrl !== rightUrl);

  const releaseValidation =
    temporaryReleaseOrVersionA.length > 0 &&
    temporaryReleaseOrVersionB.length > 0;

  const docValidation = rightDocData !== undefined && leftDocData !== undefined;

  const canSubmitValue =
    urlValidation && urlIsNotEmpty && releaseValidation && docValidation;

  function validateData(dataA: Doc | undefined, dataB: Doc | undefined) {
    validateUrl(dataA, setTemporaryReleaseOrVersionA, setLeftWarningMessage);
    validateUrl(dataB, setTemporaryReleaseOrVersionB, setRightWarningMessage);
    if (
      dataA &&
      dataB &&
      dataA.url.replace(/\d+.+\d/, '') !== dataB.url.replace(/\d+.+\d/, '')
    ) {
      if (dataA.title !== dataB.title) {
        setAlert(
          <Alert severity="error">
            You are trying to compare documents with different titles:{' '}
            <b>{dataA.title} </b> and <b>{dataB.title}</b>.
          </Alert>
        );
        setSubmittingAlert(true);
      } else if (dataA.title === dataB.title) {
        setAlert(
          <Alert severity="error">
            You are trying to compare documents that don't match.
          </Alert>
        );
        setSubmittingAlert(true);
      }
    } else if (temporaryLeftUrl === temporaryRightUrl && urlIsNotEmpty) {
      setAlert(
        <Alert severity="error">The urls you provided are the same.</Alert>
      );
      setSubmittingAlert(true);
    } else if (
      (temporaryLeftUrl.length !== 0 &&
        temporaryRightUrl.length !== 0 &&
        temporaryLeftUrl.includes('.html')) ||
      temporaryRightUrl.includes('.html')
    ) {
      setAlert(
        <Alert severity="error">
          Url should be to the root of the document, you provided a link to a
          topic.
        </Alert>
      );
      setSubmittingAlert(true);
    } else if (
      leftDocData &&
      rightDocData &&
      leftDocData.releases &&
      rightDocData.releases &&
      leftDocData.releases.length !== 0 &&
      rightDocData.releases.length !== 0
    ) {
      setAlert(
        <Alert severity="info">
          You are comparing <b>{leftDocData.title}</b> in{' '}
          <b>{leftDocData?.releases[0].name}</b> and{' '}
          <b>{rightDocData?.releases[0].name}</b>
        </Alert>
      );
      setSubmittingAlert(false);
    } else if (
      leftDocData &&
      rightDocData &&
      leftDocData.platformProductVersions[0].version &&
      rightDocData.platformProductVersions[0].version
    ) {
      setTemporaryReleaseOrVersionA(
        leftDocData.platformProductVersions[0].version.name
      );
      setTemporaryReleaseOrVersionB(
        rightDocData.platformProductVersions[0].version.name
      );
      setAlert(
        <Alert severity="info">
          You are comparing <b>{leftDocData.title}</b> in version{' '}
          <b>{leftDocData.platformProductVersions[0].version.name}</b> and{' '}
          <b>{rightDocData.platformProductVersions[0].version.name}</b>
        </Alert>
      );
      setSubmittingAlert(false);
    } else {
      setAlert(<></>);
      setSubmittingAlert(false);
    }
  }

  useEffect(() => {
    validateData(leftDocData, rightDocData);
    setCanSubmit(canSubmitValue && !submittingAlert);
    if (temporaryLeftUrl.length === 0) {
      setLeftWarningMessage('');
    }
    if (temporaryRightUrl.length === 0) {
      setRightWarningMessage('');
    }
  }, [
    leftDocData,
    rightDocData,
    temporaryLeftUrl,
    setTemporaryLeftUrl,
    temporaryRightUrl,
    setTemporaryRightUrl,
    canSubmitValue,
    temporaryReleaseOrVersionA,
    temporaryReleaseOrVersionB,
    alert,
  ]);

  function slashValidation(url: string) {
    if (url.startsWith('/') && url.endsWith('/')) {
      return url;
    } else if (url.startsWith('/') && !url.endsWith('/')) {
      return `${url}/`;
    } else if (!url.startsWith('/') && url.endsWith('/')) {
      return `/${url}`;
    } else {
      return `/${url}/`;
    }
  }
  function handleUrl(url: string) {
    if (url.includes('.net')) {
      return slashValidation(url.split(/.*.net/)[1]);
    }
    if (url.includes('.com')) {
      return slashValidation(url.split(/.*.com/)[1]);
    }
    if (url.includes('localhost')) {
      return slashValidation(url.split(/.*localhost:\d+/)[1]);
    }
  }

  function handleSubmit() {
    setLeftUrl(temporaryLeftUrl);
    setRightUrl(temporaryRightUrl);
    const leftRootUrl = handleUrl(temporaryLeftUrl);
    const rightRootUrl = handleUrl(temporaryRightUrl);
    if (leftRootUrl && rightRootUrl) {
      setFormState({
        releaseA: temporaryReleaseOrVersionA,
        releaseB: temporaryReleaseOrVersionB,
        url: leftRootUrl, //runs query on one of the urls since they're the same
        version:
          /\d/.test(temporaryReleaseOrVersionA) &&
          /\d/.test(temporaryReleaseOrVersionA)
            ? true
            : false,
      });
      setRootUrls({
        leftUrl: leftRootUrl,
        rightUrl: rightRootUrl,
      });
    } else setAlert(<Alert severity="error">The url </Alert>);
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
                value={temporaryLeftUrl}
                sx={{ width: '500px' }}
                onChange={(event) =>
                  setTemporaryLeftUrl(event.target.value as string)
                }
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
                value={temporaryRightUrl}
                sx={{ width: '500px' }}
                onChange={(event) =>
                  setTemporaryRightUrl(event.target.value as string)
                }
              />
              <FormHelperText
                sx={{ fontSize: '14px', height: '30px', maxWidth: '420px' }}
              >
                {rightWarningMessage}
              </FormHelperText>
            </Stack>
          </Stack>
          <Stack sx={{ height: '60px' }}>{alert}</Stack>
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
