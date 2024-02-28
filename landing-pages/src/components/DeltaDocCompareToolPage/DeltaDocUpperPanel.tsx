import { Typography } from '@mui/material';
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
import { useEffect, useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';

const releaseDates = [
  { release: 'Kufri', date: '202406' },
  { release: 'Jasper', date: '202402' },
  { release: 'Innsbruck', date: '202310' },
  { release: 'Hakuba', date: '202306' },
  { release: 'Garmisch', date: '202302' },
  { release: 'Flaine', date: '202209' },
  { release: 'Elysian', date: '202205' },
  { release: 'Dobson', date: '202111' },
  { release: 'Cortina', date: '202104' },
];

export default function DeltaDocUpperPanel() {
  const [leftUrl, setLeftUrl] = useState('');
  const [rightUrl, setRightUrl] = useState('');
  const [temporaryUrl, setTemporaryUrl] = useState('');
  const [temporaryReleaseA, setTemporaryReleaseA] = useState('');
  const [temporaryReleaseB, setTemporaryReleaseB] = useState('');
  const { releaseA, releaseB, url, setFormState } = useDeltaDocContext();
  const { releases, isLoading, isError } = useReleasesNoRevalidation();

  useEffect(() => {
    const version = releaseDates.find((object) => {
      return object.release === temporaryReleaseA;
    });
    if (version && leftUrl && rightUrl) {
      setTemporaryUrl(`/${leftUrl}/${version.date}/${rightUrl}/`);
    }
  }, [leftUrl, rightUrl, setTemporaryUrl, temporaryUrl, temporaryReleaseA]);

  const canSubmit =
    (temporaryReleaseA !== releaseA ||
      temporaryReleaseB !== releaseB ||
      temporaryUrl !== url) &&
    rightUrl.length > 0 &&
    leftUrl.length > 0 &&
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
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography>/</Typography>
            <TextField
              label="Left URL"
              value={leftUrl}
              fullWidth
              onChange={(event) => setLeftUrl(event.target.value as string)}
            />
            <Typography>/</Typography>
            <Typography>version</Typography>
            <Typography>/</Typography>
            <TextField
              label="Right URL"
              value={rightUrl}
              fullWidth
              onChange={(event) => setRightUrl(event.target.value as string)}
            />
            <Typography>/</Typography>
          </Stack>
          <FormHelperText sx={{ fontSize: '14px' }}>
            Example for url <b>/cloud/pc/202302/devsetup/</b>: <br />
            left URL would be <b>cloud/pc</b> <br />
            right URL would be <b>devsetup</b>
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
