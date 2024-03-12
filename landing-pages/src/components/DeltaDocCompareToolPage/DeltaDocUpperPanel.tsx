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
  setRelease: (value: React.SetStateAction<string>) => void,
  setHelperTextMessage: (value: React.SetStateAction<string>) => void
) {
  const urlRelease = data?.releases;
  if (urlRelease) {
    setRelease(urlRelease[0].name);
    setHelperTextMessage(
      `This document belongs to release: ${urlRelease[0].name}.`
    );
  } else {
    setHelperTextMessage('No doc matches this url.');
  }
}

export default function DeltaDocUpperPanel() {
  const [leftUrl, setLeftUrl] = useState('');
  const [rightUrl, setRightUrl] = useState('');
  const [temporaryLeftUrl, setTemporaryLeftUrl] = useState('');
  const [temporaryRightUrl, setTemporaryRightUrl] = useState('');
  const [temporaryReleaseA, setTemporaryReleaseA] = useState('');
  const [temporaryReleaseB, setTemporaryReleaseB] = useState('');
  const [leftWarningMessage, setLeftWarningMessage] = useState('');
  const [rightWarningMessage, setRightWarningMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [submittingAlert, setSubmittingAlert] = useState(false);
  const [alert, setAlert] = useState<JSX.Element>();
  const { setFormState, setRootUrls } = useDeltaDocContext();
  const leftRootUrlNoSlash = /cloud\/.*/.exec(temporaryLeftUrl);
  const rightRootUrlNoSlash = /cloud\/.*/.exec(temporaryRightUrl);

  const {
    docData: leftDocData,
    isError: leftIsError,
    isLoading: leftIsLoading,
  } = useDeltaDocValidator(
    leftRootUrlNoSlash ? leftRootUrlNoSlash[0].slice(0, -1) : ''
  );

  const {
    docData: rightDocData,
    isError: rightIsError,
    isLoading: rightLeftError,
  } = useDeltaDocValidator(
    rightRootUrlNoSlash ? rightRootUrlNoSlash[0].slice(0, -1) : ''
  );

  const urlIsNotEmpty =
    temporaryRightUrl.length !== 0 && temporaryLeftUrl.length !== 0;
  const urlValidation =
    temporaryLeftUrl !== temporaryRightUrl &&
    (temporaryLeftUrl !== leftUrl || temporaryRightUrl !== rightUrl);

  const releaseValidation =
    temporaryReleaseA.length > 0 && temporaryReleaseB.length > 0;

  const docValidation = rightDocData !== undefined && leftDocData !== undefined;

  const canSubmitValue =
    urlValidation && urlIsNotEmpty && releaseValidation && docValidation;

  function validateData(dataA: Doc | undefined, dataB: Doc | undefined) {
    // TODO:
    //   - validate jutro and self-managed docs, now works only on cloud/..

    validateUrl(dataA, setTemporaryReleaseA, setLeftWarningMessage);
    validateUrl(dataB, setTemporaryReleaseB, setRightWarningMessage);
    if (
      dataA &&
      dataB &&
      dataA.url.replace(/\d+/, '') !== dataB.url.replace(/\d+/, '')
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
      rightDocData.releases
    ) {
      setAlert(
        <Alert severity="info">
          You are comparing <b>{leftDocData.title}</b> in{' '}
          <b>{leftDocData?.releases[0].name}</b> and{' '}
          <b>{rightDocData?.releases[0].name}</b>
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
    temporaryReleaseA,
    temporaryReleaseB,
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
        releaseA: temporaryReleaseA ? temporaryReleaseA : '',
        releaseB: temporaryReleaseB ? temporaryReleaseB : '',
        url: leftRootUrl, //runs query on one of the urls since they're the same
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
