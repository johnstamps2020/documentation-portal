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
import { Release } from 'server/dist/model/entity/Release';
import { useReleaseData } from 'hooks/useEntitiesData';

type NewRelease = Omit<Release, 'uuid'>;

export const emptyRelease: NewRelease = {
  name: '',
  public: false,
  internal: false,
  earlyAccess: false,
  isInProduction: false
};

type ReleaseSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialReleaseData?: NewRelease;
};

async function sendRequest(url: string, { arg }: { arg: NewRelease }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpReleaseData(releaseData: NewRelease | undefined) {
  return releaseData ? releaseData : emptyRelease;
}

export default function ReleaseSettingsForm({
  primaryKey: nameFromProps,
  disabled,
  initialReleaseData,
}: ReleaseSettingsFormProps) {
  const [releaseName, setReleaseName] = useState(nameFromProps);
  const { showMessage } = useNotification();
  const { releaseData, isError, isLoading } = useReleaseData(releaseName);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Release',
    sendRequest
  );
  const [tmpReleaseData, setTmpReleaseData] = useState(
    generateTmpReleaseData(initialReleaseData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [releaseAlreadyExists, setReleaseAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    releaseName &&
      releaseData &&
      setTmpReleaseData(generateTmpReleaseData(releaseData));
  }, [releaseData, releaseName]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialReleaseData || releaseData;
    if (
      JSON.stringify(tmpReleaseData) ===
      JSON.stringify(generateTmpReleaseData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpReleaseData, releaseData, releaseName, initialReleaseData]);

  useEffect(() => {
    if (
      isMutating ||
      releaseAlreadyExists ||
      jsonIsInvalid ||
      !tmpReleaseData.name
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    releaseData,
    tmpReleaseData,
    releaseAlreadyExists,
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
        <Typography variant="h2">Problem loading release data</Typography>
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
    setTmpReleaseData((currentTmpReleaseData) => ({
      ...currentTmpReleaseData,
      [field]: value,
    }));

    if (field === 'name') {
      setReleaseAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = releaseData || initialReleaseData;
    setTmpReleaseData(generateTmpReleaseData(resetToData));
    setReleaseAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfReleaseExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Release?name=${tmpReleaseData.name}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.name === tmpReleaseData.name &&
      releaseData?.name !== tmpReleaseData.name
    );
  }

  async function handleSave() {
    try {
      const ReleaseExists = await checkIfReleaseExists();
      if (ReleaseExists) {
        setReleaseAlreadyExists(true);
        return;
      }
      let dataToSave = tmpReleaseData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Release saved successfully', 'success');
        setReleaseName(tmpReleaseData.name);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Release not saved: ${err}`, 'error');
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
        error={releaseAlreadyExists}
        helperText={
          releaseAlreadyExists && 'Release with this name already exists'
        }
        disabled={editingDisabled}
        label="Name"
        value={tmpReleaseData.name}
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
                      tmpReleaseData[key as keyof typeof releaseData] as boolean
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
