import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useReleasesNoRevalidation } from 'hooks/useApi';
import { useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocUpperPanel() {
  const [temporaryUrl, setTemporaryUrl] = useState('');
  const [temporaryReleaseA, setTemporaryReleaseA] = useState('');
  const [temporaryReleaseB, setTemporaryReleaseB] = useState('');
  const { releaseA, releaseB, url, setFormState } = useDeltaDocContext();
  const { releases, isLoading, isError } = useReleasesNoRevalidation();

  const canSubmit =
    (temporaryReleaseA !== releaseA ||
      temporaryReleaseB !== releaseB ||
      temporaryUrl !== url) &&
    temporaryUrl.length > 0 &&
    temporaryReleaseA.length > 0 &&
    temporaryReleaseB.length > 0;

  function handleSubmit() {
    setFormState({
      releaseA: temporaryReleaseA,
      releaseB: temporaryReleaseB,
      url: temporaryUrl,
    });
  }

  if (isError || isLoading || !releases) {
    return null;
  }

  const ReleaseMenuItem = releases
    .sort((a, b) => {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    })
    .map((release, key) => (
      <MenuItem key={key} value={release.name}>
        {release.name}
      </MenuItem>
    ));

  return (
    <Container>
      <Stack spacing={2} sx={{ py: '1rem' }}>
        <FormControl sx={{ width: '450px', mr: 'auto' }}>
          <InputLabel>Release A</InputLabel>
          <Select
            label="Release A to compare"
            value={temporaryReleaseA}
            onChange={(event: SelectChangeEvent) =>
              setTemporaryReleaseA(event.target.value as string)
            }
          >
            {ReleaseMenuItem}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '450px' }}>
          <InputLabel>Release B</InputLabel>
          <Select
            label="Release B to compare"
            value={temporaryReleaseB}
            onChange={(event: SelectChangeEvent) =>
              setTemporaryReleaseB(event.target.value as string)
            }
          >
            {ReleaseMenuItem}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '450px', alignItems: 'center' }}>
          <TextField
            label="Doc URL to compare within releases"
            value={temporaryUrl}
            fullWidth
            onChange={(event) => setTemporaryUrl(event.target.value as string)}
          />
          <FormHelperText sx={{ fontSize: '14px' }}>
            Provide a URL that fits following pattern:{' '}
            <b>/cloud/xx/000000/xxxx/</b> <br /> (eq.{' '}
            <b>/cloud/pc/202302/devsetup/</b> or{' '}
            <b>/cloud/is/202306/contact/</b>)
          </FormHelperText>
          <Button
            variant="contained"
            sx={{ mt: '12px', width: '250px' }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            See results
          </Button>
        </FormControl>
      </Stack>
    </Container>
  );
}
