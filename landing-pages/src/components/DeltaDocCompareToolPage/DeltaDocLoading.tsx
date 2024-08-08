import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export default function DeltaDocLoading() {
  return (
    <Stack alignItems="center">
      <CircularProgress disableShrink />
    </Stack>
  );
}
