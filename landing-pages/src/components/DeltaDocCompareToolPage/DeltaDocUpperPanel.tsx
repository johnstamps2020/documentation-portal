import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDeltaDocContext } from './DeltaDocContext';
import { useReleasesNoRevalidation } from 'hooks/useApi';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Container from '@mui/material/Container';

export default function DeltaDocUpperPanel() {
  const [temporaryUrl, setTemporaryUrl] = useState('');
  const { releaseA, releaseB, setReleaseA, setReleaseB, setUrl } =
    useDeltaDocContext();
  const { releases, isLoading, isError } = useReleasesNoRevalidation();

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
            value={releaseA}
            onChange={(event: SelectChangeEvent) =>
              setReleaseA(event.target.value as string)
            }
          >
            {ReleaseMenuItem}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '450px' }}>
          <InputLabel>Release B</InputLabel>
          <Select
            label="Release B to compare"
            value={releaseB}
            onChange={(event: SelectChangeEvent) =>
              setReleaseB(event.target.value as string)
            }
          >
            {ReleaseMenuItem}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '450px', alignItems: "center" }}>
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
            variant="outlined"
            sx={{ mt: '12px', width: "250px" }}
            onClick={() => setUrl(temporaryUrl)}
          >
            See results
          </Button>
        </FormControl>
      </Stack>
    </Container>
  );
}
