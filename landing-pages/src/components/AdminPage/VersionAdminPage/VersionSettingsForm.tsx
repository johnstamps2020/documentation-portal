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
import useSWRMutation from 'swr/mutation';
import { Version } from '@doctools/server';
import { useVersionData } from 'hooks/useEntitiesData';

type NewVersion = Omit<Version, 'uuid'>;

export const emptyVersion: NewVersion = {
  name: '',
  public: false,
  internal: false,
  earlyAccess: false,
  isInProduction: false,
};

type VersionSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialVersionData?: NewVersion;
};

async function sendRequest(url: string, { arg }: { arg: NewVersion }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpVersionData(versionData: NewVersion | undefined) {
  return versionData ? versionData : emptyVersion;
}

export default function VersionSettingsForm({
  primaryKey: nameFromProps,
  disabled,
  initialVersionData,
}: VersionSettingsFormProps) {
  const [versionName, setVersionName] = useState(nameFromProps);
  const { showMessage } = useNotification();
  const { versionData, isError, isLoading } = useVersionData(versionName);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Version',
    sendRequest
  );
  const [tmpVersionData, setTmpVersionData] = useState(
    generateTmpVersionData(initialVersionData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [VersionAlreadyExists, setVersionAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    versionName &&
      versionData &&
      setTmpVersionData(generateTmpVersionData(versionData));
  }, [versionData, versionName]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialVersionData || versionData;
    if (
      JSON.stringify(tmpVersionData) ===
      JSON.stringify(generateTmpVersionData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpVersionData, versionData, versionName, initialVersionData]);

  useEffect(() => {
    if (
      isMutating ||
      VersionAlreadyExists ||
      jsonIsInvalid ||
      !tmpVersionData.name
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    versionData,
    tmpVersionData,
    VersionAlreadyExists,
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
        <Typography variant="h2">Problem loading version data</Typography>
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
    setTmpVersionData((currentTmpVersionData) => ({
      ...currentTmpVersionData,
      [field]: value,
    }));

    if (field === 'name') {
      setVersionAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = versionData || initialVersionData;
    setTmpVersionData(generateTmpVersionData(resetToData));
    setVersionAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfVersionExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Version?name=${tmpVersionData.name}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.name === tmpVersionData.name &&
      versionData?.name !== tmpVersionData.name
    );
  }

  async function handleSave() {
    try {
      const VersionExists = await checkIfVersionExists();
      if (VersionExists) {
        setVersionAlreadyExists(true);
        return;
      }
      let dataToSave = tmpVersionData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Version saved successfully', 'success');
        setVersionName(tmpVersionData.name);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Version not saved: ${err}`, 'error');
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
        error={VersionAlreadyExists}
        helperText={
          VersionAlreadyExists && 'Version with this name already exists'
        }
        disabled={editingDisabled}
        label="Name"
        value={tmpVersionData.name}
        onChange={(event) => handleChange('name', event.target.value)}
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
                disabled={editingDisabled}
                key={key}
                control={
                  <Switch
                    value={key}
                    checked={
                      tmpVersionData[key as keyof typeof versionData] as boolean
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
