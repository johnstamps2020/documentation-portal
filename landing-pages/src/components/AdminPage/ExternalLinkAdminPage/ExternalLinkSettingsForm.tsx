import { ExternalLink } from '@doctools/server';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useExternalLinkData } from 'hooks/useEntitiesData';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import AdminBooleanToggles from '../AdminBooleanToggles';
import { useSWRConfig } from 'swr';

type NewExternalLink = Omit<ExternalLink, 'uuid'>;

export const emptyExternalLink: NewExternalLink = {
  url: '',
  label: '',
  internal: false,
  public: false,
  earlyAccess: false,
  isInProduction: false,
};

type ExternalLinkSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialExternalLinkData?: NewExternalLink;
};

async function sendRequest(url: string, { arg }: { arg: NewExternalLink }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpExternalLinkData(
  externalLinkData: NewExternalLink | undefined
) {
  return externalLinkData ? externalLinkData : emptyExternalLink;
}

export default function ExternalLinkSettingsForm({
  primaryKey: urlFromProps,
  disabled,
  initialExternalLinkData,
}: ExternalLinkSettingsFormProps) {
  const [externalLinkUrl, setExternalLinkUrl] = useState(urlFromProps);
  const { showMessage } = useNotification();
  const { externalLinkData, isError, isLoading } =
    useExternalLinkData(externalLinkUrl);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/ExternalLink',
    sendRequest
  );
  const { mutate } = useSWRConfig();
  const [tmpExternalLinkData, setTmpExternalLinkData] = useState(
    generateTmpExternalLinkData(initialExternalLinkData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [externalLinkAlreadyExists, setExternalLinkAlreadyExists] =
    useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    externalLinkUrl &&
      externalLinkData &&
      setTmpExternalLinkData(generateTmpExternalLinkData(externalLinkData));
  }, [externalLinkData, externalLinkUrl]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialExternalLinkData || externalLinkData;
    if (
      JSON.stringify(tmpExternalLinkData) ===
      JSON.stringify(generateTmpExternalLinkData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [
    tmpExternalLinkData,
    externalLinkData,
    externalLinkUrl,
    initialExternalLinkData,
  ]);

  useEffect(() => {
    if (
      isMutating ||
      externalLinkAlreadyExists ||
      jsonIsInvalid ||
      !tmpExternalLinkData.url ||
      !tmpExternalLinkData.label
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    externalLinkData,
    tmpExternalLinkData,
    externalLinkAlreadyExists,
    jsonIsInvalid,
    isMutating,
  ]);

  if (isError) {
    return (
      <Stack
        sx={{
          padding: 4,
        }}
      >
        <Typography variant="h2">Problem loading external link data</Typography>
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
    setTmpExternalLinkData((currentTmpExternalLinkData) => ({
      ...currentTmpExternalLinkData,
      [field]: value,
    }));

    if (field === 'url') {
      setExternalLinkAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = externalLinkData || initialExternalLinkData;
    setTmpExternalLinkData(generateTmpExternalLinkData(resetToData));
    setExternalLinkAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfExternalLinkExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/ExternalLink?url=${tmpExternalLinkData.url}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.url === tmpExternalLinkData.url &&
      externalLinkData?.url !== tmpExternalLinkData.url
    );
  }

  async function handleSave() {
    try {
      const externalLinkExists = await checkIfExternalLinkExists();
      if (externalLinkExists) {
        setExternalLinkAlreadyExists(true);
        return;
      }
      let dataToSave = tmpExternalLinkData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('External link saved successfully', 'success');
        setExternalLinkUrl(tmpExternalLinkData.url);
        setDataChanged(false);
        mutate('/safeConfig/entity/ExternalLink/all');
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`External link not saved: ${err}`, 'error');
    }
  }

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        backgroundColor: 'white',
        py: 4,
      }}
    >
      <TextField
        required
        error={externalLinkAlreadyExists}
        helperText={
          externalLinkAlreadyExists &&
          'External link with this url already exists'
        }
        disabled={editingDisabled}
        label="Url"
        value={tmpExternalLinkData.url}
        onChange={(event) => handleChange('url', event.target.value)}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
        label="Label"
        onChange={(event) => handleChange('label', event.target.value)}
        value={tmpExternalLinkData.label}
        fullWidth
      />
      <AdminBooleanToggles
        editingDisabled={editingDisabled}
        entityProps={tmpExternalLinkData}
        handleChange={handleChange}
      />
      <Stack direction="row" spacing={1}>
        <ButtonGroup disabled={disabled || !dataChanged}>
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
