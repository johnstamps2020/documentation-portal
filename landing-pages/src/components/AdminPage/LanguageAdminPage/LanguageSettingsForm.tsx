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
import { Language } from '@doctools/server';
import { useLanguageData } from 'hooks/useEntitiesData';

type NewLanguage = Omit<Language, 'uuid'>;

export const emptyLanguage: NewLanguage = {
  label: '',
  code: '',
  public: false,
  internal: false,
  earlyAccess: false,
  isInProduction: false,
};

type LanguageSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialLanguageData?: NewLanguage;
};

async function sendRequest(url: string, { arg }: { arg: NewLanguage }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpLanguageData(languageData: NewLanguage | undefined) {
  return languageData ? languageData : emptyLanguage;
}

export default function LanguageSettingsForm({
  primaryKey: codeFromProps,
  disabled,
  initialLanguageData,
}: LanguageSettingsFormProps) {
  const [languageCode, setLanguageCode] = useState(codeFromProps);
  const { showMessage } = useNotification();
  const { languageData, isError, isLoading } = useLanguageData(languageCode);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Language',
    sendRequest
  );
  const [tmpLanguageData, setTmpLanguageData] = useState(
    generateTmpLanguageData(initialLanguageData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [LanguageAlreadyExists, setLanguageAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    languageCode &&
      languageData &&
      setTmpLanguageData(generateTmpLanguageData(languageData));
  }, [languageData, languageCode]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialLanguageData || languageData;
    if (
      JSON.stringify(tmpLanguageData) ===
      JSON.stringify(generateTmpLanguageData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpLanguageData, languageData, languageCode, initialLanguageData]);

  useEffect(() => {
    if (
      isMutating ||
      LanguageAlreadyExists ||
      jsonIsInvalid ||
      !tmpLanguageData.code
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    languageData,
    tmpLanguageData,
    LanguageAlreadyExists,
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
        <Typography variant="h2">Problem loading language data</Typography>
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
    setTmpLanguageData((currentTmpLanguageData) => ({
      ...currentTmpLanguageData,
      [field]: value,
    }));

    if (field === 'code') {
      setLanguageAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = languageData || initialLanguageData;
    setTmpLanguageData(generateTmpLanguageData(resetToData));
    setLanguageAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfLanguageExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Language?code=${tmpLanguageData.code}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.code === tmpLanguageData.code &&
      languageData?.code !== tmpLanguageData.code
    );
  }

  async function handleSave() {
    try {
      const LanguageExists = await checkIfLanguageExists();
      if (LanguageExists) {
        setLanguageAlreadyExists(true);
        return;
      }
      let dataToSave = tmpLanguageData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Language saved successfully', 'success');
        setLanguageCode(tmpLanguageData.code);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Language not saved: ${err}`, 'error');
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
        disabled={editingDisabled}
        label="Label"
        value={tmpLanguageData.label}
        onChange={(event) => handleChange('label', event.target.value)}
        fullWidth
      />
      <TextField
        required
        error={LanguageAlreadyExists}
        helperText={
          LanguageAlreadyExists && 'Language with this code already exists'
        }
        disabled={editingDisabled}
        label="Code"
        value={tmpLanguageData.code}
        onChange={(event) => handleChange('code', event.target.value)}
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
                      tmpLanguageData[
                        key as keyof typeof languageData
                      ] as boolean
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
