import { Source } from '@doctools/server';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useSourceData } from 'hooks/useEntitiesData';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import AdminBooleanToggles from '../AdminBooleanToggles';

type NewSource = Omit<Source, 'uuid'>;

export const emptySource: NewSource = {
  id: '',
  name: '',
  gitUrl: '',
  gitBranch: '',
  internal: false,
  public: false,
  earlyAccess: false,
  isInProduction: false,
};

type SourceSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialSourceData?: NewSource;
};

async function sendRequest(id: string, { arg }: { arg: NewSource }) {
  return await fetch(id, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpSourceData(sourceData: NewSource | undefined) {
  return sourceData ? sourceData : emptySource;
}

export default function SourceSettingsForm({
  primaryKey: idFromProps,
  disabled,
  initialSourceData,
}: SourceSettingsFormProps) {
  const [sourceId, setSourceId] = useState(idFromProps);
  const { showMessage } = useNotification();
  const { sourceData, isError, isLoading } = useSourceData(sourceId);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Source',
    sendRequest
  );
  const [tmpSourceData, setTmpSourceData] = useState(
    generateTmpSourceData(initialSourceData)
  );

  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [sourceAlreadyExists, setSourceAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    sourceId &&
      sourceData &&
      setTmpSourceData(generateTmpSourceData(sourceData));
  }, [sourceData, sourceId]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialSourceData || sourceData;
    if (
      JSON.stringify(tmpSourceData) ===
      JSON.stringify(generateTmpSourceData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpSourceData, sourceData, sourceId, initialSourceData]);

  useEffect(() => {
    if (
      isMutating ||
      sourceAlreadyExists ||
      jsonIsInvalid ||
      !tmpSourceData.id
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    sourceData,
    tmpSourceData,
    sourceAlreadyExists,
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
        <Typography variant="h2">Problem loading source data</Typography>
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
    setTmpSourceData((currentTmpSourceData) => ({
      ...currentTmpSourceData,
      [field]: value,
    }));

    if (field === 'id') {
      setSourceAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = sourceData || initialSourceData;
    setTmpSourceData(generateTmpSourceData(resetToData));
    setSourceAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfSourceExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Source?id=${tmpSourceData.id}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.id === tmpSourceData.id && sourceData?.id !== tmpSourceData.id
    );
  }

  async function handleSave() {
    try {
      const externalLinkExists = await checkIfSourceExists();
      if (externalLinkExists) {
        setSourceAlreadyExists(true);
        return;
      }
      let dataToSave = tmpSourceData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Source saved successfully', 'success');
        setSourceId(tmpSourceData.id);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Source not saved: ${err}`, 'error');
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
        error={sourceAlreadyExists}
        helperText={sourceAlreadyExists && 'Source with this id already exists'}
        disabled={editingDisabled}
        label="Id"
        value={tmpSourceData.id}
        onChange={(event) => handleChange('id', event.target.value)}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
        label="Name"
        onChange={(event) => handleChange('name', event.target.value)}
        value={tmpSourceData.name}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
        label="Git url"
        onChange={(event) => handleChange('gitUrl', event.target.value)}
        value={tmpSourceData.gitUrl}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
        label="Git branch"
        onChange={(event) => handleChange('gitBranch', event.target.value)}
        value={tmpSourceData.gitBranch}
        fullWidth
      />
      <AdminBooleanToggles
        editingDisabled={editingDisabled}
        entityProps={tmpSourceData}
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
