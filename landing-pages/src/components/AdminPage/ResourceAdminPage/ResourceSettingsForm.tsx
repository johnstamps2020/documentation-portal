import { Resource, Source, useSources } from '@doctools/server';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useResourceData } from 'hooks/useEntitiesData';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import AdminBooleanToggles from '../AdminBooleanToggles';
import SourceTextFields from './SourceTextFields';

type NewResourceWithRelations = Omit<Resource, 'uuid'>;
type NewResource = Omit<NewResourceWithRelations, 'source'>;

export const emptyResource: NewResource = {
  id: '',
  internal: false,
  public: false,
  earlyAccess: false,
  isInProduction: false,
  sourceFolder: '',
  targetFolder: '',
};

type ResourceSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialResourceData?: NewResourceWithRelations;
};

async function sendRequest(id: string, { arg }: { arg: NewResource }) {
  return await fetch(id, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpResourceData(
  ResourceData: NewResourceWithRelations | undefined
): NewResource | NewResourceWithRelations {
  return ResourceData ? ResourceData : emptyResource;
}

export default function ResourceSettingsForm({
  primaryKey: idFromProps,
  disabled,
  initialResourceData,
}: ResourceSettingsFormProps) {
  const [resourceId, setResourceId] = useState(idFromProps);
  const { showMessage } = useNotification();
  const { resourceData, isError, isLoading } = useResourceData(resourceId);
  const {
    sources,
    isLoading: sourcesIsLoading,
    isError: sourcesIsError,
  } = useSources();
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Resource',
    sendRequest
  );
  const [tmpResourceData, setTmpResourceData] = useState(
    generateTmpResourceData(initialResourceData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [ResourceAlreadyExists, setResourceAlreadyExists] = useState<boolean>();
  const [sourceCollapse, setSourceCollapse] = useState(false);
  const [sourceListCollapse, setSourceListCollapse] = useState(false);
  const [sourceError, setSourceError] = useState(false);

  useEffect(() => {
    resourceId &&
      resourceData &&
      setTmpResourceData(generateTmpResourceData(resourceData));
  }, [resourceData, resourceId]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialResourceData || resourceData;
    if (
      JSON.stringify(tmpResourceData) ===
      JSON.stringify(generateTmpResourceData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpResourceData, resourceData, resourceId, initialResourceData]);

  useEffect(() => {
    if (isMutating || ResourceAlreadyExists || !tmpResourceData.id) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [resourceData, tmpResourceData, ResourceAlreadyExists, isMutating]);

  if (isError || sourcesIsError) {
    const errorMessage = isError ? 'Resource data' : 'Sources';
    return (
      <Stack
        sx={{
          padding: 4,
        }}
      >
        <Typography variant="h2">Problem loading {errorMessage}</Typography>
        <pre>
          <code>{JSON.stringify(isError, null, 2)}</code>
        </pre>
      </Stack>
    );
  }

  if (isLoading || sourcesIsLoading) {
    return <CircularProgress />;
  }

  async function handleChange(field: string, value: string | boolean | Source) {
    if (field === 'source') {
      const source = sources?.find((s) => s.id === value);
      setTmpResourceData((currentTmpResourceData) => ({
        ...currentTmpResourceData,
        [field]: source,
      }));
    } else {
      setTmpResourceData((currentTmpResourceData) => ({
        ...currentTmpResourceData,
        [field]: value,
      }));
    }

    if (field === 'id') {
      setResourceAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = resourceData || initialResourceData;
    setTmpResourceData(generateTmpResourceData(resetToData));
    setResourceAlreadyExists(false);
  }

  async function checkIfResourceExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Resource?id=${tmpResourceData.id}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.id === tmpResourceData.id &&
      resourceData?.id !== tmpResourceData.id
    );
  }

  async function handleSave() {
    try {
      const resourceExists = await checkIfResourceExists();
      if (resourceExists) {
        setResourceAlreadyExists(true);
        return;
      }
      if (!('source' in tmpResourceData)) {
        setSourceError(true);
        setSourceCollapse(true);
        setSourceListCollapse(true);
        return;
      }
      let dataToSave = tmpResourceData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Resource saved successfully', 'success');
        setResourceId(tmpResourceData.id);
        setDataChanged(false);
        setSourceError(false);
        setSourceCollapse(false);
        setSourceListCollapse(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Resource not saved: ${err}`, 'error');
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
        error={ResourceAlreadyExists}
        helperText={
          ResourceAlreadyExists && 'Resource with this id already exists'
        }
        disabled={editingDisabled}
        label="Id"
        value={tmpResourceData.id}
        onChange={(event) => handleChange('id', event.target.value)}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
        label="Source folder"
        onChange={(event) => handleChange('sourceFolder', event.target.value)}
        value={tmpResourceData.sourceFolder}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
        label="Target folder"
        onChange={(event) => handleChange('targetFolder', event.target.value)}
        value={tmpResourceData.targetFolder}
        fullWidth
      />
      <Button
        onClick={() => setSourceCollapse(!sourceCollapse)}
        fullWidth
        variant="outlined"
      >
        Source
      </Button>
      <Collapse in={sourceCollapse}>
        <Stack spacing={1} paddingBottom="24px">
          <Button
            color="success"
            variant="outlined"
            onClick={() => setSourceListCollapse(!sourceListCollapse)}
            disabled={editingDisabled}
            fullWidth
          >
            Pick source from the list
          </Button>
          {sources && (
            <Collapse in={sourceListCollapse}>
              <FormControl sx={{ width: '300px' }} required>
                <InputLabel>New source</InputLabel>
                <Select
                  label="New source"
                  onChange={(event) => {
                    handleChange('source', event.target.value as string);
                    setSourceCollapse(true);
                  }}
                  defaultValue=""
                  error={sourceError}
                >
                  {sources.map(({ uuid, ...source }) => (
                    <MenuItem
                      key={uuid}
                      sx={{ maxWidth: '500px', overflowX: 'revert' }}
                      value={source.id}
                    >
                      {source.name} ({source.id})
                    </MenuItem>
                  ))}
                </Select>
                {sourceError && (
                  <FormHelperText error>Source is required</FormHelperText>
                )}
              </FormControl>
            </Collapse>
          )}
        </Stack>
        {'source' in tmpResourceData && tmpResourceData.source && (
          <SourceTextFields source={tmpResourceData.source} />
        )}
      </Collapse>
      <AdminBooleanToggles
        editingDisabled={editingDisabled}
        entityProps={tmpResourceData}
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
