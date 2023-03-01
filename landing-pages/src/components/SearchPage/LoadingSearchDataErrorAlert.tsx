import Alert from '@mui/material/Alert/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSearchData } from '../../hooks/useApi';

export default function LoadingSearchDataErrorAlert() {
  const { isError } = useSearchData();
  if (!isError) {
    return null;
  }
  return (
    <Alert severity="error" variant="filled">
      <Stack>
        <Typography>{isError.status}</Typography>
        <Typography>{isError.message}</Typography>
      </Stack>
    </Alert>
  );
}
