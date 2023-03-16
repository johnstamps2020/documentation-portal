import useSWRMutation from 'swr/mutation';
import Alert, { AlertColor } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { usePageData } from '../../hooks/usePageData';
import { Page } from 'server/dist/model/entity/Page';
import Snackbar from '@mui/material/Snackbar';

const emptyPage: Page = {
  path: '',
  title: '',
  component: '',
  searchFilters: {},
  internal: true,
  public: false,
  earlyAccess: true,
  isInProduction: false,
};

type PagePropsControllerProps = {
  pagePath: string;
  fullEditMode?: boolean;
};

type EditMessage = {
  text: string;
  severity: AlertColor;
  isOpen: boolean;
};

const emptyEditMessage: EditMessage = {
  text: '',
  severity: 'info',
  isOpen: false,
};

async function sendRequest(url: string, { arg }: { arg: Page }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

export default function PagePropsController({
  pagePath,
  fullEditMode = false,
}: PagePropsControllerProps) {
  const { pageData, isError, isLoading } = usePageData(pagePath);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Page',
    sendRequest
  );
  const [tmpPageData, setTmpPageData] = useState(emptyPage);
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [pageAlreadyExists, setPageAlreadyExists] = useState<boolean>();
  const [editResultMessage, setEditResultMessage] =
    useState<EditMessage>(emptyEditMessage);

  useEffect(() => {
    pageData && setTmpPageData(pageData);
  }, [pageData]);

  useEffect(() => {
    if (
      isMutating ||
      pageAlreadyExists ||
      JSON.stringify(tmpPageData) === JSON.stringify(pageData)
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [pageData, tmpPageData, pageAlreadyExists, isMutating]);

  if (isError || isLoading || !pageData) {
    return null;
  }

  function handleCloseEditResultMessage() {
    setEditResultMessage(emptyEditMessage);
  }

  async function pageExists() {
    const response = await fetch(
      `/safeConfig/entity/Page?path=${tmpPageData.path}`
    );
    const jsonData = await response.json();
    console.log(response.ok);
    console.log({ jsonData }, jsonData.path === tmpPageData.path);
    console.log(pageData?.path !== tmpPageData.path);
    if (
      response.ok &&
      jsonData.path === tmpPageData.path &&
      pageData?.path !== tmpPageData.path
    ) {
      setPageAlreadyExists(true);
    } else {
      setPageAlreadyExists(false);
    }
  }

  function handleChange(field: string, value: string | boolean) {
    setTmpPageData({
      ...tmpPageData,
      [field]: value,
    });
  }

  function handleResetForm() {
    setTmpPageData(pageData || emptyPage);
  }

  async function handleSave() {
    try {
      const response = await trigger(tmpPageData);
      if (response?.ok) {
        setEditResultMessage({
          text: 'Page updated successfully',
          severity: 'success',
          isOpen: true,
        });
      } else if (response) {
        const jsonError = await response.json();
        setEditResultMessage({
          text: `Page not updated: ${jsonError.message}`,
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (err) {
      setEditResultMessage({
        text: `Page not updated: ${err}`,
        severity: 'error',
        isOpen: true,
      });
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
      <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
        {fullEditMode ? 'Page properties' : pagePath}
      </Typography>
      {fullEditMode && (
        <TextField
          required
          error={pageAlreadyExists}
          helperText={pageAlreadyExists && 'Page with this path already exists'}
          disabled={isMutating}
          label="Path"
          value={tmpPageData.path}
          onChange={(event) => handleChange('path', event.target.value)}
          onBlur={pageExists}
        />
      )}
      <TextField
        required
        disabled={isMutating}
        label="Title"
        onChange={(event) => handleChange('title', event.target.value)}
        value={tmpPageData.title}
      />
      <TextField
        disabled={isMutating}
        label="Component"
        onChange={(event) => handleChange('component', event.target.value)}
        value={tmpPageData.component}
      />
      <FormGroup row>
        {['internal', 'public', 'earlyAccess', 'isInProduction'].map((key) => (
          <FormControlLabel
            disabled={isMutating}
            key={key}
            control={
              <Switch
                value={key}
                checked={tmpPageData[key as keyof typeof pageData] as boolean}
                onChange={(event) => handleChange(key, event.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={key}
          />
        ))}
      </FormGroup>
      <Stack direction="row" spacing={1}>
        <ButtonGroup disabled={!canSubmitData}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="warning" onClick={handleResetForm}>
            Reset
          </Button>
        </ButtonGroup>
      </Stack>
      <Snackbar
        open={editResultMessage.isOpen}
        onClose={handleCloseEditResultMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseEditResultMessage}
          sx={{ width: '100%' }}
          severity={editResultMessage.severity}
        >
          {editResultMessage.text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
