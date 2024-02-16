import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDeltaDocContext } from './DeltaDocLayoutContext';
import { useReleases } from 'hooks/useApi';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Container from '@mui/material/Container';

export default function DeltaDocUpperPanel() {
  const [temporaryUrl, setTemporaryUrl] = useState('');
  const { releaseA, releaseB, setReleaseA, setReleaseB, url, setUrl } =
    useDeltaDocContext();
  const { releases, isLoading, isError } = useReleases();

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
        <FormControl sx={{ width: '450px' }}>
          <TextField
            label="Doc URL to compare within releases"
            value={temporaryUrl}
            onChange={(event) => setTemporaryUrl(event.target.value as string)}
          />
          <Button onClick={() => setUrl(temporaryUrl)}>See results</Button>
          <FormHelperText>
            Ensure you account for doc sets that may have similar URLs, e.g.
            bc/xx/xx/xx and pc/xx/xx/xx\nEnter the directory you want to scan,
            including the first and last slash (/):
          </FormHelperText>
        </FormControl>
      </Stack>
    </Container>
  );
}
