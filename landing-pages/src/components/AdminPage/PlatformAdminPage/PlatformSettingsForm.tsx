import { Platform } from '@doctools/components';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { usePlatformData } from 'hooks/useEntitiesData';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import AdminBooleanToggles from '../AdminBooleanToggles';

type NewPlatform = Omit<Platform, 'uuid'>;

export const emptyPlatform: NewPlatform = {
  name: '',
  public: false,
  internal: false,
  earlyAccess: false,
  isInProduction: false,
};

type PlatformSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialPlatformData?: NewPlatform;
};

async function sendRequest(url: string, { arg }: { arg: NewPlatform }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpPlatformData(platformData: NewPlatform | undefined) {
  return platformData ? platformData : emptyPlatform;
}

export default function PlatformSettingsForm({
  primaryKey: nameFromProps,
  disabled,
  initialPlatformData,
}: PlatformSettingsFormProps) {
  const [platformName, setPlatformName] = useState(nameFromProps);
  const { showMessage } = useNotification();
  const { platformData, isError, isLoading } = usePlatformData(platformName);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Platform',
    sendRequest
  );
  const [tmpPlatformData, setTmpPlatformData] = useState(
    generateTmpPlatformData(initialPlatformData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [PlatformAlreadyExists, setPlatformAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    platformName &&
      platformData &&
      setTmpPlatformData(generateTmpPlatformData(platformData));
  }, [platformData, platformName]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialPlatformData || platformData;
    if (
      JSON.stringify(tmpPlatformData) ===
      JSON.stringify(generateTmpPlatformData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpPlatformData, platformData, platformName, initialPlatformData]);

  useEffect(() => {
    if (
      isMutating ||
      PlatformAlreadyExists ||
      jsonIsInvalid ||
      !tmpPlatformData.name
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    platformData,
    tmpPlatformData,
    PlatformAlreadyExists,
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
        <Typography variant="h2">Problem loading platform data</Typography>
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
    setTmpPlatformData((currentTmpPlatformData) => ({
      ...currentTmpPlatformData,
      [field]: value,
    }));

    if (field === 'name') {
      setPlatformAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = platformData || initialPlatformData;
    setTmpPlatformData(generateTmpPlatformData(resetToData));
    setPlatformAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfPlatformExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Platform?name=${tmpPlatformData.name}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.name === tmpPlatformData.name &&
      platformData?.name !== tmpPlatformData.name
    );
  }

  async function handleSave() {
    try {
      const PlatformExists = await checkIfPlatformExists();
      if (PlatformExists) {
        setPlatformAlreadyExists(true);
        return;
      }
      let dataToSave = tmpPlatformData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Platform saved successfully', 'success');
        setPlatformName(tmpPlatformData.name);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Platform not saved: ${err}`, 'error');
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
        error={PlatformAlreadyExists}
        helperText={
          PlatformAlreadyExists && 'Platform with this name already exists'
        }
        disabled={editingDisabled}
        label="Name"
        value={tmpPlatformData.name}
        onChange={(event) => handleChange('name', event.target.value)}
        fullWidth
      />
      <AdminBooleanToggles
        editingDisabled={editingDisabled}
        entityProps={tmpPlatformData}
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
