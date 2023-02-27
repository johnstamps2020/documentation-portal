import Alert from '@mui/material/Alert/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSearch } from '../../context/SearchContext';

export default function LoadingSearchDataErrorAlert() {
  const { loadingSearchDataError } = useSearch();
  if (!loadingSearchDataError) {
    return null;
  }
  return (
    <Alert severity="error" variant="filled">
      <Stack>
        <Typography>{loadingSearchDataError.status}</Typography>
        <Typography>{loadingSearchDataError.message}</Typography>
      </Stack>
    </Alert>
  );
}
