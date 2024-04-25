import { Subject } from '@doctools/server';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useSubjectData } from 'hooks/useEntitiesData';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import AdminBooleanToggles from '../AdminBooleanToggles';

type NewSubject = Omit<Subject, 'uuid'>;

export const emptySubject: NewSubject = {
  name: '',
  public: false,
  internal: false,
  earlyAccess: false,
  isInProduction: false,
};

type SubjectSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialSubjectData?: NewSubject;
};

async function sendRequest(url: string, { arg }: { arg: NewSubject }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpSubjectData(SubjectData: NewSubject | undefined) {
  return SubjectData ? SubjectData : emptySubject;
}

export default function SubjectSettingsForm({
  primaryKey: nameFromProps,
  disabled,
  initialSubjectData,
}: SubjectSettingsFormProps) {
  const [subjectName, setSubjectName] = useState(nameFromProps);
  const { showMessage } = useNotification();
  const { subjectData, isError, isLoading } = useSubjectData(subjectName);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Subject',
    sendRequest
  );
  const [tmpSubjectData, setTmpSubjectData] = useState(
    generateTmpSubjectData(initialSubjectData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [SubjectAlreadyExists, setSubjectAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    subjectName &&
      subjectData &&
      setTmpSubjectData(generateTmpSubjectData(subjectData));
  }, [subjectData, subjectName]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialSubjectData || subjectData;
    if (
      JSON.stringify(tmpSubjectData) ===
      JSON.stringify(generateTmpSubjectData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpSubjectData, subjectData, subjectName, initialSubjectData]);

  useEffect(() => {
    if (
      isMutating ||
      SubjectAlreadyExists ||
      jsonIsInvalid ||
      !tmpSubjectData.name
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    subjectData,
    tmpSubjectData,
    SubjectAlreadyExists,
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
        <Typography variant="h2">Problem loading subject data</Typography>
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
    setTmpSubjectData((currentTmpSubjectData) => ({
      ...currentTmpSubjectData,
      [field]: value,
    }));

    if (field === 'name') {
      setSubjectAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = subjectData || initialSubjectData;
    setTmpSubjectData(generateTmpSubjectData(resetToData));
    setSubjectAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfSubjectExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Subject?name=${tmpSubjectData.name}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.name === tmpSubjectData.name &&
      subjectData?.name !== tmpSubjectData.name
    );
  }

  async function handleSave() {
    try {
      const SubjectExists = await checkIfSubjectExists();
      if (SubjectExists) {
        setSubjectAlreadyExists(true);
        return;
      }
      let dataToSave = tmpSubjectData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Subject saved successfully', 'success');
        setSubjectName(tmpSubjectData.name);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Subject not saved: ${err}`, 'error');
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
        error={SubjectAlreadyExists}
        helperText={
          SubjectAlreadyExists && 'Subject with this name already exists'
        }
        disabled={editingDisabled}
        label="Name"
        value={tmpSubjectData.name}
        onChange={(event) => handleChange('name', event.target.value)}
        fullWidth
      />
      <AdminBooleanToggles
        editingDisabled={editingDisabled}
        entityProps={tmpSubjectData}
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
