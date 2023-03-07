import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { Page } from 'server/dist/model/entity/Page';

export default function PagePropsController(pageData: Page) {
  const [pageDataFromDb, setPageDataFromDb] = useState(pageData);
  const [tmpPageData, setTmpPageData] = useState(pageData);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [openSaveChangesMessage, setOpenSaveChangesMessage] = useState(false);
  const [readOnlyMode, setReadOnlyMode] = useState(true);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSaveChangesMessage(false);
    setIsSavingChanges(false);
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTmpPageData({
      ...tmpPageData,
      [event.target.value]: event.target.checked,
    });
  }

  function handleCancel() {
    setTmpPageData(pageDataFromDb);
    toggleReadOnlyMode();
  }

  async function handleSave() {
    setIsSavingChanges(true);
    const response = await fetch(`/safeConfig/entity/Page`, {
      method: 'PUT',
      body: JSON.stringify(tmpPageData),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      setPageDataFromDb(tmpPageData);
      setReadOnlyMode(true);
      setOpenSaveChangesMessage(true);
    }
    setIsSavingChanges(false);
  }

  function toggleReadOnlyMode() {
    setReadOnlyMode(!readOnlyMode);
  }

  return (
    <Stack
      spacing={1}
      sx={{
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '12px',
      }}
    >
      <FormGroup row>
        {['internal', 'public', 'earlyAccess', 'isInProduction'].map(key => (
          <FormControlLabel
            disabled={readOnlyMode}
            key={key}
            control={
              <Switch
                value={key}
                checked={
                  tmpPageData[key as keyof typeof tmpPageData] as boolean
                }
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={key}
          />
        ))}
      </FormGroup>
      {readOnlyMode ? (
        <Button variant="contained" onClick={toggleReadOnlyMode}>
          Edit
        </Button>
      ) : (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            disabled={isSavingChanges || pageDataFromDb === tmpPageData}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" color="warning" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      )}
      {openSaveChangesMessage && (
        <Alert severity="success" onClose={handleClose}>
          Changes saved successfully!
        </Alert>
      )}
    </Stack>
  );
}
