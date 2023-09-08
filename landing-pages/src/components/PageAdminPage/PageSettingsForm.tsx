import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useEffect, useState } from 'react';
import { Page } from 'server/dist/model/entity/Page';
import useSWRMutation from 'swr/mutation';
import { usePageData } from '../../hooks/usePageData';

type NewPage = Omit<Page, 'uuid'>;

export const emptyPage: NewPage = {
  path: '',
  title: '',
  searchFilters: {},
  internal: true,
  public: false,
  earlyAccess: true,
  isInProduction: false,
};

type PageSettingsFormProps = {
  pagePath?: string;
  title: string;
};

async function sendRequest(url: string, { arg }: { arg: NewPage }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

export default function PageSettingsForm({
  pagePath,
  title,
}: PageSettingsFormProps) {
  const { showMessage } = useNotification();
  const { pageData, isError, isLoading } = usePageData(pagePath);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Page',
    sendRequest
  );
  const [tmpPageData, setTmpPageData] = useState(emptyPage);
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [pageAlreadyExists, setPageAlreadyExists] = useState<boolean>();

  useEffect(() => {
    pagePath && pageData && setTmpPageData(pageData);
  }, [pageData, pagePath]);

  useEffect(() => {
    if (
      (!pagePath &&
        JSON.stringify(tmpPageData) === JSON.stringify(emptyPage)) ||
      JSON.stringify(tmpPageData) === JSON.stringify(pageData)
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpPageData, pageData, pagePath]);

  useEffect(() => {
    if (
      isMutating ||
      pageAlreadyExists ||
      !tmpPageData.path ||
      !tmpPageData.title
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [pageData, tmpPageData, pageAlreadyExists, isMutating]);

  if (isError && isError.status !== 307) {
    return (
      <Stack
        sx={{
          padding: 4,
        }}
      >
        <Typography variant="h2">Problem loading page data</Typography>
        <pre>
          <code>{JSON.stringify(isError, null, 2)}</code>
        </pre>
      </Stack>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  function handleChange(field: string, value: string | boolean) {
    setTmpPageData({
      ...tmpPageData,
      [field]: value,
    });
  }

  function handleResetForm() {
    if (pagePath && pageData) {
      setTmpPageData(pageData);
    } else {
      setTmpPageData(emptyPage);
    }
    setPageAlreadyExists(false);
  }

  async function checkIfPageExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Page?path=${tmpPageData.path}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    if (
      jsonData.path === tmpPageData.path &&
      pageData?.path !== tmpPageData.path
    ) {
      return true;
    }

    return false;
  }

  async function handleSave() {
    try {
      const pageExists = await checkIfPageExists();
      if (pageExists) {
        setPageAlreadyExists(true);
        return;
      }

      const response = await trigger(tmpPageData);

      if (response?.ok) {
        showMessage('Page updated successfully', 'success');
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Page not updated: ${err}`, 'error');
    }
  }

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: '4px',
        padding: '12px',
        margin: '16px',
        maxWidth: 'fit-content',
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 800 }} variant="h2">
        {title}
      </Typography>
      <TextField
        required
        error={pageAlreadyExists}
        helperText={pageAlreadyExists && 'Page with this path already exists'}
        disabled={isMutating}
        label="Path"
        value={tmpPageData.path}
        onChange={(event) => handleChange('path', event.target.value)}
        fullWidth
      />
      <TextField
        required
        disabled={isMutating}
        label="Title"
        onChange={(event) => handleChange('title', event.target.value)}
        value={tmpPageData.title}
        fullWidth
      />
      <FormGroup>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {['internal', 'public', 'earlyAccess', 'isInProduction'].map(
            (key) => (
              <FormControlLabel
                disabled={isMutating}
                key={key}
                control={
                  <Switch
                    value={key}
                    checked={
                      tmpPageData[key as keyof typeof pageData] as boolean
                    }
                    onChange={(event) =>
                      handleChange(key, event.target.checked)
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={key}
              />
            )
          )}
        </Box>
      </FormGroup>
      <Stack direction="row" spacing={1}>
        <ButtonGroup disabled={!dataChanged}>
          <Button
            disabled={!canSubmitData}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" color="warning" onClick={handleResetForm}>
            Reset
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
