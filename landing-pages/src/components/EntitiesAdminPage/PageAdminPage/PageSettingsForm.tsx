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
import { usePageData } from '../../../hooks/usePageData';
import { SearchFilters } from 'server/dist/types/config';

type NewPage = Omit<Page, 'uuid'> & { stringifiedSearchFilters?: string };

export const emptyPage: NewPage = {
  path: '',
  title: '',
  searchFilters: {},
  stringifiedSearchFilters: '{}',
  internal: true,
  public: false,
  earlyAccess: true,
  isInProduction: false,
};

type PageSettingsFormProps = {
  pagePath?: string;
  disabled?: boolean;
  initialPageData?: NewPage;
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

function generateTmpPageData(pageData: NewPage | undefined) {
  return pageData
    ? {
        ...pageData,
        stringifiedSearchFilters: JSON.stringify(
          pageData.searchFilters,
          null,
          4
        ),
      }
    : emptyPage;
}

export default function PageSettingsForm({
  pagePath: pagePathFromProps,
  disabled,
  initialPageData,
}: PageSettingsFormProps) {
  const [pagePath, setPagePath] = useState(pagePathFromProps);
  const { showMessage } = useNotification();
  const { pageData, isError, isLoading } = usePageData(pagePath);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Page',
    sendRequest
  );
  const [tmpPageData, setTmpPageData] = useState(
    generateTmpPageData(initialPageData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [pageAlreadyExists, setPageAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    pagePath && pageData && setTmpPageData(generateTmpPageData(pageData));
  }, [pageData, pagePath]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialPageData || pageData;
    if (
      JSON.stringify(tmpPageData) ===
      JSON.stringify(generateTmpPageData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpPageData, pageData, pagePath, initialPageData]);

  useEffect(() => {
    if (
      isMutating ||
      pageAlreadyExists ||
      jsonIsInvalid ||
      !tmpPageData.path ||
      !tmpPageData.title
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [pageData, tmpPageData, pageAlreadyExists, jsonIsInvalid, isMutating]);

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
    setTmpPageData((currentTmpPageData) => ({
      ...currentTmpPageData,
      [field]: value,
    }));

    if (field === 'path') {
      setPageAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = pageData || initialPageData;
    setTmpPageData(generateTmpPageData(resetToData));
    setPageAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  function convertValuesOfSearchFiltersToArray(searchFiltersJson: {}): SearchFilters {
    return Object.entries(searchFiltersJson).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = value;
      } else {
        acc[key] = Array.of(value) as string[];
      }
      return acc;
    }, {} as SearchFilters);
  }

  function handleValidateAndPrettify() {
    try {
      const { stringifiedSearchFilters } = tmpPageData;
      if (!stringifiedSearchFilters) {
        return;
      }
      const parsedJson = JSON.parse(stringifiedSearchFilters);
      const normalizedJson = convertValuesOfSearchFiltersToArray(parsedJson);
      setTmpPageData({
        ...tmpPageData,
        stringifiedSearchFilters: JSON.stringify(normalizedJson, null, 4),
      });
      showMessage('Looking good, feeling good 🤩', 'success');
      setJsonIsInvalid(false);
    } catch (err) {
      setJsonIsInvalid(true);
      showMessage((err as Error).message, 'error');
      return;
    }
  }

  async function checkIfPageExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Page?path=${tmpPageData.path}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.path === tmpPageData.path && pageData?.path !== tmpPageData.path
    );
  }

  async function handleSave() {
    try {
      const pageExists = await checkIfPageExists();
      if (pageExists) {
        setPageAlreadyExists(true);
        return;
      }
      let dataToSave = tmpPageData;
      if (tmpPageData.stringifiedSearchFilters) {
        const parsedSearchFilters = JSON.parse(
          tmpPageData.stringifiedSearchFilters
        );
        const normalizedSearchFilters =
          convertValuesOfSearchFiltersToArray(parsedSearchFilters);
        setTmpPageData({
          ...tmpPageData,
          stringifiedSearchFilters: JSON.stringify(
            normalizedSearchFilters,
            null,
            4
          ),
        });
        dataToSave = {
          ...tmpPageData,
          searchFilters: normalizedSearchFilters,
        };
      }
      delete tmpPageData.stringifiedSearchFilters;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Page saved successfully', 'success');
        setPagePath(tmpPageData.path);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Page not saved: ${err}`, 'error');
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
        error={pageAlreadyExists}
        helperText={pageAlreadyExists && 'Page with this path already exists'}
        disabled={editingDisabled}
        label="Path"
        value={tmpPageData.path}
        onChange={(event) => handleChange('path', event.target.value)}
        fullWidth
      />
      <TextField
        required
        disabled={editingDisabled}
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
                disabled={editingDisabled}
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
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Typography variant="h3">Search filters</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleValidateAndPrettify}
          disabled={editingDisabled}
        >
          Validate and Prettify
        </Button>
        <TextField
          disabled={editingDisabled}
          onChange={(event) =>
            handleChange('stringifiedSearchFilters', event.target.value)
          }
          error={jsonIsInvalid}
          helperText="If a filter value is a string, it is automatically converted to an array when you validate or save."
          value={tmpPageData.stringifiedSearchFilters}
          multiline
          fullWidth
          minRows={10}
          maxRows={10}
          sx={{
            backgroundColor: '#ffffff',
            maxWidth: '400px',
          }}
        />
      </Stack>
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
